
export interface IViewScales<T> {
    main: T;
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    gtXs?: T;
    gtSm?: T;
    gtMd?: T;
    gtLg?: T;
    ltSm?: T;
    ltMd?: T;
    ltLg?: T;
    ltXl?: T;
}

export interface MapType<T> {
    [key: string]: T;
}

export enum RunDetection {
    SelfChanged,
    AnyChanged,
    Custom
}

export interface IRunContext {
    checked: boolean;
    checklist: MapType<any>; // TODO SET REAL FIELD TYPE
    field: any; // TODO SET REAL FIELD TYPE
}

export interface ICustomRunDetectionStrategy {
    strategy(context: IRunContext): boolean;
}

export interface IRunDecoration {
    name: string;
    runDetection?: RunDetection;
}
