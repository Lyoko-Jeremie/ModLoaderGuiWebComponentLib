import JSZip from "jszip";
import type {LifeTimeCircleHook, LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import type {NgGuiWebComponentLibBoot} from "../NgGuiWebComponentLib/out-tsc/app/main";
import type {ModBootJson, ModInfo} from "../../../dist-BeforeSC2/ModLoader";
import {isArray, isNil, isString, every} from 'lodash';
import JSON5 from 'json5';
import {EsModuleStarter} from "./EsModuleStarter";
import {IGuiWebComponentLib} from "./IGuiWebComponentLib";


export class GuiWebComponentLib implements IGuiWebComponentLib {
    logger: LogWrapper;

    modName!: string;

    get modLoaderVersion(): string {
        return this.gModUtils.version;
    }

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

    ngGuiWebComponentLibRef?: NgGuiWebComponentLibBoot;

    async init() {
        if (!this.modName) {
            console.error("[GuiWebComponentLib] init() modName invalid, GuiWebComponentLib state error");
            this.logger.error("[GuiWebComponentLib] init() modName invalid, GuiWebComponentLib state error");
            return;
        }

        if (window.modNgGuiWebComponentLibBootstrapFactory) {
            this.ngGuiWebComponentLibRef = await window.modNgGuiWebComponentLibBootstrapFactory();
        }
        if (!window.modNgGuiWebComponentLib || !this.ngGuiWebComponentLibRef) {
            console.error("[GuiWebComponentLib] init() modNgGuiWebComponentLib not init complete");
            this.logger.error("[GuiWebComponentLib] init() modNgGuiWebComponentLib not init complete");
            return;
        }
        await this.ngGuiWebComponentLibRef.init();

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
