export interface IMsgParams {
    [key: string]: any;
}

export interface IValidatorResult {
    error: boolean;
    msgParams?: IMsgParams;
}
