import { MapType } from './misc';

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
