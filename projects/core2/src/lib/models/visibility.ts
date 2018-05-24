import { Type } from '@angular/core';

import { Observable } from 'rxjs';

import { Metadata } from '../metadata';
import { IRunContext, IRunDecoration } from '../misc';
import { Field } from './field';

export interface IOnVisible<P = any> {
    calculate(context: IRunContext, params?: P): boolean | Observable<boolean>;
}

export type VisibleType<P = any> = Type<IOnVisible<P>>;

export function Visible(options: IRunDecoration): ClassDecorator {
    return (target: Function): void => {
        Metadata.addVisible(options, <VisibleType>target);
    };
}

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

export class Visibility {

    private _visField: Field = <any>undefined;

    protected _initVisibility(validation: IVisibility | undefined, field: Field): void {
        this._visField = field;
    }
}
