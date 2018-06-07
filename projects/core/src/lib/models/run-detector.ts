import { Type } from '@angular/core';

import { Loader } from '../loader';
import { Metadata } from '../metadata';
import { IEffectContext } from './effect';

export interface IRunDetector {
    strategy(context: IEffectContext): boolean;
}

export type RunDetectorType = Type<IRunDetector>;

export function RunDetector(name: string): ClassDecorator {
    return (target: Function): void => {
        Metadata.addRunDetector(name, <RunDetectorType>target);
    };
}

export class RunDetectorHandler {

    private _instance: IRunDetector;

    constructor(name: string) {
        this._instance = Loader.get(Metadata.getRunDetector(name).target);
    }

    public eval(context: IEffectContext): boolean {
        return this._instance.strategy(context);
    }
}
