import { Type } from '@angular/core';

import { Observable } from 'rxjs';

import { IRunContext } from './run';

export interface IValidatorSchema {
    id?: string;
    validator: string;
    params: any;
    errorMsg: string;
}

export interface IValidationSchema {
    validators?: IValidatorSchema[];
    forcedError?: string;
    errorStateWhen?: string;
}

export interface IValidator<P = any> {
    validate(context: IRunContext, params?: P): any | Observable<any>;
}

export type ValidatorType<P = any> = Type<IValidator<P>>;
