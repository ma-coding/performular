import { Type } from '@angular/core';

import { Observable } from 'rxjs';

import { IRunContext } from './run';

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

export interface IValidationSchema {
    validation?: IValidation;
}

export interface IValidator<P = any> {
    validate(context: IRunContext, params?: P): any | Observable<any>; // TODO: Set return type
}

export type ValidatorType<P = any> = Type<IValidator<P>>;
