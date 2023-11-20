export interface LogWrapper {
    log: (s: string) => void;
    warn: (s: string) => void;
    error: (s: string) => void;
}

export interface IGuiWebComponentLib {
    modName: string;
    logger: LogWrapper;

    get modLoaderVersion(): string;
}
