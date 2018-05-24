import { Type } from '@angular/core';

import { Observable } from 'rxjs';

import { IRunContext } from './run';

export interface IVisible<P = any> {
    id?: string;
    visible: string;
    params?: P;
}

export interface IVisibility {
    hides?: IVisible[];
    disables?: IVisible[];
    forcedHidden?: boolean;
    forcedDisabled?: boolean;
}

export interface IVisibilitySchema {
    visibility?: IVisibility;
}

export interface IVisible<P = any> {
    calculate(context: IRunContext, params?: P): boolean | Observable<boolean>;
}

export type VisibleType<P = any> = Type<IVisible<P>>;
