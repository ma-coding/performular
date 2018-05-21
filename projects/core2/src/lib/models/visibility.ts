import { Type } from '@angular/core';

import { Observable } from 'rxjs';

import { IRunContext } from './run';

export interface IVisibleSchema<P = any> {
    id?: string;
    visible: string;
    params?: P;
}

export interface IVisibilitySchema {
    hides?: IVisibleSchema[];
    disables?: IVisibleSchema[];
    forcedHidden?: boolean;
    forcedDisabled?: boolean;
}

export interface IVisible<P = any> {
    calculate(context: IRunContext, params?: P): boolean | Observable<boolean>;
}

export type VisibleType<P = any> = Type<IVisible<P>>;
