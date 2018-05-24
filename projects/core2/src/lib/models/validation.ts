import { Type } from '@angular/core';

import { Observable } from 'rxjs';

import { Metadata } from '../metadata';
import { IRunContext, IRunDecoration } from '../misc';
import { Field } from './field';

export interface IOnValidate<P = any> {
    validate(context: IRunContext, params?: P): any | Observable<any>; // TODO: Set return type
}

export type ValidatorType<P = any> = Type<IOnValidate<P>>;

export function Validator(options: IRunDecoration): ClassDecorator {
    return (target: Function): void => {
        Metadata.addValidator(options, <ValidatorType>target);
    };
}

export interface IValidator {
    id?: string;
    validator: string;
    params: any;
    errorMsg: string;
}

export interface IValidation {
    validators?: IValidator[];
    forcedError?: string;
    errorStateWhen?: string;
}

export class Validation {

    private _valField: Field = <any>undefined;

    protected _initValidation(validation: IValidation | undefined, field: Field): void {
        this._valField = field;
    }
}
