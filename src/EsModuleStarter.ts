import type {LifeTimeCircleHook, LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import type {ModBootJson, ModInfo} from "../../../dist-BeforeSC2/ModLoader";
import {isArray, isNil, isString, every} from 'lodash';
import JSZip from "jszip";
import JSON5 from "json5";

export interface EsModuleStarterConfigConfig {
    jsFileList: string[];
    includeDir: string[];
}

export class EsModuleStarter {

    configFilePath = 'EsModuleStarterConfig.json5';

    private thisWin;
    private logger: LogWrapper;

    constructor(
        private modName: string,
        private zip: JSZip,
        private mod: ModInfo,
        private gSC2DataManager: SC2DataManager,
        private gModUtils: ModUtils,
    ) {
        this.logger = gModUtils.getLogger();
        this.thisWin = gModUtils.getThisWindow();
    }

    private insertScript(
        src: string,
        scriptName: string,
        modName: string,
        sourceMapSrc?: string,
    ) {
        const script = this.thisWin.document.createElement('script');
        if (sourceMapSrc) {
            // `//# sourceMappingURL=polyfills.js.map`
            // `//# sourceMappingURL=data:application/json;charset=utf-8;base64,`
            script.innerHTML = src.replace(
                /^\/\/# sourceMappingURL=.+map$/gm,
                `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${atob(sourceMapSrc)}`,
            );
        } else {
            script.innerHTML = src;
        }
        script.setAttribute('scriptName', (scriptName));
        script.setAttribute('modName', (modName));
        script.setAttribute('stage', ('EsModuleStarter'));
        script.setAttribute('type', ('module'));
        this.thisWin.document.head.appendChild(script);
    }

    private insertCss(
        src: string,
        scriptName: string,
        modName: string,
        sourceMapSrc?: string,
    ) {
        const newStyleNode = this.thisWin.document.createElement('style');
        newStyleNode.setAttribute('type', 'text/css');
        newStyleNode.setAttribute('role', 'stylesheet');
        newStyleNode.setAttribute('scriptName', (scriptName));
        newStyleNode.setAttribute('modName', (modName));
        newStyleNode.setAttribute('stage', ('EsModuleStarter'));
        if (sourceMapSrc) {
            // `/*# sourceMappingURL=styles.css.map */`
            // `/*# sourceMappingURL=data:application/json;charset=utf-8;base64,`
            newStyleNode.textContent = src.replace(
                /^\/\*# sourceMappingURL=.+?\*\/$/gm,
                `/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${atob(sourceMapSrc)} */`,
            );
        } else {
            newStyleNode.textContent = src;
        }
        this.thisWin.document.head.appendChild(newStyleNode);
    }

    async init() {
        const configJson = await this.zip.file(this.configFilePath)?.async('string');
        if (!configJson) {
            console.error(`[EsModuleStarter][${this.modName}] init() cannot get configJson`);
            this.logger.error(`[EsModuleStarter][${this.modName}}] init() cannot get configJson`);
            return;
        }
        try {
            this.config = JSON5.parse(configJson);
            if (!(isArray(this.config.jsFileList) && every(this.config.jsFileList, isString()))) {
                console.error(`[EsModuleStarter][${this.modName}] init() config.jsFileList invalid`);
                this.logger.error(`[EsModuleStarter][${this.modName}] init() config.jsFileList invalid`);
                return;
            }
            if (!(isArray(this.config.includeDir) && every(this.config.includeDir, isString()))) {
                console.error(`[EsModuleStarter][${this.modName}] init() config.includeDir invalid`);
                this.logger.error(`[EsModuleStarter][${this.modName}] init() config.includeDir invalid`);
                return;
            }

            await this.jsFileList();
            await this.includeDir();

        } catch (e: Error | any) {
            console.error(`[EsModuleStarter][${this.modName}] init() configJson error`, e);
            this.logger.error(`[EsModuleStarter][${this.modName}] init() configJson error`);
            return;
        }
    }

    config?: EsModuleStarterConfigConfig;

    readFile: Set<string> = new Set<string>();

    async jsFileList() {
        for (const jsF of this.config?.jsFileList ?? []) {
            const jsFileSrc = await this.zip.file(jsF)?.async('string');
            if (!jsFileSrc) {
                console.error(`[EsModuleStarter][${this.modName}] jsFileList() cannot get jsFileSrc [${jsF}]`);
                this.logger.error(`[EsModuleStarter][${this.modName}] jsFileList() cannot get jsFileSrc [${jsF}]`);
                return;
            }
            // check have sourceMap file
            const sourceMapSrc = await this.zip.file(jsF + '.map')?.async('string');
            this.insertScript(jsFileSrc, jsF, this.modName, sourceMapSrc);

            this.readFile.add(jsF);
            if (sourceMapSrc) {
                this.readFile.add(jsF + '.map');
            }
        }
    }

    async includeDir() {
        for (const iD of this.config?.includeDir ?? []) {
            const files: [string, JSZip.JSZipObject][] = [];
            this.zip.forEach((relativePath, file) => {
                if (relativePath.startsWith(iD)) {
                    files.push([relativePath, file]);
                }
            });
            if (files.length === 0) {
                console.warn(`[EsModuleStarter][${this.modName}] includeDir() cannot get files from [${iD}]`);
                this.logger.warn(`[EsModuleStarter][${this.modName}] includeDir() cannot get files from [${iD}]`);
                continue;
            }
            console.log('[EsModuleStarter][${this.modName}] includeDir() files', files);
            const filesT = files.filter(T => {
                const n = T[0];
                return n.endsWith('.js') || n.endsWith('.css') || n.endsWith('.map');
            }).filter(T => !this.readFile.has(T[0]));
            console.log('[EsModuleStarter][${this.modName}] includeDir() filesT', filesT);

            for (const ft of filesT) {
                if (ft[0].endsWith('.js')) {
                    // check have sourceMap file
                    const jsFileSrc = await ft[1].async('string');
                    const sourceMapSrc = await this.zip.file(ft[0] + '.map')?.async('string');
                    this.insertScript(jsFileSrc, ft[0], this.modName, sourceMapSrc);

                    this.readFile.add(ft[0]);
                    if (sourceMapSrc) {
                        this.readFile.add(ft[0] + '.map');
                    }
                }
            }

            for (const ft of filesT) {
                if (ft[0].endsWith('.css')) {
                    // check have sourceMap file
                    const cssFileSrc = await ft[1].async('string');
                    const sourceMapSrc = await this.zip.file(ft[0] + '.map')?.async('string');
                    this.insertCss(cssFileSrc, ft[0], this.modName, sourceMapSrc);

                    this.readFile.add(ft[0]);
                    if (sourceMapSrc) {
                        this.readFile.add(ft[0] + '.map');
                    }
                }
            }
        }
    }

}
