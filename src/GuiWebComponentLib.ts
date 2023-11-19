import JSZip from "jszip";
import type {LifeTimeCircleHook, LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import type {ModBootJson, ModInfo} from "../../../dist-BeforeSC2/ModLoader";
import {isArray, isNil, isString, every} from 'lodash';
import JSON5 from 'json5';

class EsModuleStarter {

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

    async init() {
        const configJson = await this.zip.file(this.configFilePath)?.async('string');
        if (!configJson) {
            console.error(`[EsModuleStarter][${this.modName}] init() cannot get configJson`);
            this.logger.error(`[EsModuleStarter][${this.modName}}] init() cannot get configJson`);
            return;
        }
        try {
            const config = JSON5.parse(configJson);
            if (!(isArray(config.jsFileList) && every(config.jsFileList, isString()))) {
                console.error(`[EsModuleStarter][${this.modName}] init() config.jsFileList invalid`);
                this.logger.error(`[EsModuleStarter][${this.modName}] init() config.jsFileList invalid`);
                return;
            }
            for (const jsF of config.jsFileList) {
                const jsFileSrc = await this.zip.file(jsF)?.async('string');
                if (!jsFileSrc) {
                    console.error(`[EsModuleStarter][${this.modName}] init() cannot get jsFileSrc ${jsF}`);
                    this.logger.error(`[EsModuleStarter][${this.modName}] init() cannot get jsFileSrc ${jsF}`);
                    return;
                }
                // check have sourceMap file
                const sourceMapSrc = await this.zip.file(jsF + '.map')?.async('string');
                this.insertScript(jsFileSrc, jsF, this.modName, sourceMapSrc);
            }
        } catch (e: Error | any) {
            console.error(`[EsModuleStarter][${this.modName}] init() configJson parse error`, e);
            this.logger.error(`[EsModuleStarter][${this.modName}] init() configJson parse error`);
            return;
        }
    }
}

export class GuiWebComponentLib {
    private logger: LogWrapper;

    modName!: string;

    constructor(
        public gSC2DataManager: SC2DataManager,
        public gModUtils: ModUtils,
    ) {
        this.logger = gModUtils.getLogger();
        const modName = gModUtils.getNowRunningModName();
        if (!modName) {
            console.error("[GuiWebComponentLib] cannot get NowRunningModName");
            this.logger.error("[GuiWebComponentLib] cannot get NowRunningModName");
            return;
        }
        this.modName = modName;

        const selfMod = this.gModUtils.getMod(this.modName);
        if (!selfMod) {
            console.error("[GuiWebComponentLib][${this.modName}] cannot get selfMod. never go there.");
            this.logger.error("[GuiWebComponentLib][${this.modName}] cannot get selfMod. never go there.");
            return;
        }
        selfMod.modRef = this;
    }

    async init() {
        if (!this.modName) {
            console.error("[GuiWebComponentLib] init() modName invalid, GuiWebComponentLib state error");
            this.logger.error("[GuiWebComponentLib] init() modName invalid, GuiWebComponentLib state error");
            return;
        }
        const zip = this.gModUtils.getModZip(this.modName);
        const mod = this.gModUtils.getMod(this.modName);
        if (!zip) {
            console.error("[GuiWebComponentLib] init() cannot getModZip");
            this.logger.error("[GuiWebComponentLib] init() cannot getModZip");
            return;
        }
        if (!mod) {
            console.error("[GuiWebComponentLib] init() cannot getMod");
            this.logger.error("[GuiWebComponentLib] init() cannot getMod");
            return;
        }
        const stater = new EsModuleStarter(
            this.modName,
            zip.zip,
            mod,
            this.gSC2DataManager,
            this.gModUtils,
        );

        return await stater.init();
    }
}
