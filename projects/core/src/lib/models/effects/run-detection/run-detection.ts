import { Type } from '@angular/core';

import { Store } from '../../../form/store';
import { IEffectContext } from '../effect';

export interface IRunDetector {
    strategy(context: IEffectContext): boolean;
}

export type RunDetectorType = Type<IRunDetector>;

export function RunDetector(name: string): ClassDecorator {
    return (target: Function): void => {
        Store.addRunDetector(name, <any>target);
    };
}

export class RunDetection {

    private _instance: IRunDetector;

    constructor(name: string) {
        this._instance = Store.getRunDetector(name).instance;
    }

    public eval(context: IEffectContext): boolean {
        return this._instance.strategy(context);
    }
}
