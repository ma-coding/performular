import { Type } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { createObservable, MapType } from '../misc';
import { State } from '../state';
import { EffectHandler, IEffect, IEffectContext, IOnEffect } from './effect';
import { Field } from './field';

export type IValidatorError = MapType<any> | undefined;

export interface IOnValidate<P = any> extends IOnEffect<IValidatorError | Observable<IValidatorError>, P> {
    instanceRendered?(field: Field, params: P): void;
}

export type ValidatorType<P = any> = Type<IOnValidate<P>>;

export interface IValidator extends IEffect {
    errorMsg: string;
}

export interface IValidatorState {
    result: IValidatorError;
    errorMsg: string;
    error: string | undefined;
}

export class ValidatorHandler extends EffectHandler<IValidator, IValidatorError | Observable<IValidatorError>> {

    private _validator$: State<IValidatorState>;

    constructor(validator: IValidator) {
        super(validator);
        this._validator$ = new State<IValidatorState>({
            result: undefined,
            errorMsg: validator.errorMsg,
            error: undefined
        });
    }

    public error(): string | undefined {
        return this._validator$.getValue().error;
    }

    public run(context: IEffectContext): Observable<void> {
        if (!this.runDetector.eval(context)) {
            return of();
        }
        return createObservable(
            this.instance.calculate(context, this.params)
        ).pipe(
            map((res: IValidatorError) => {
                this._validator$.update({
                    result: res,
                    error: res ? this._buildError(res) : undefined
                });
            })
        );
    }

    public instanceRendered(field: Field): void {
        const instance: IOnValidate = <IOnValidate>this.instance;
        if (instance.instanceRendered) {
            instance.instanceRendered(field, this.params);
        }
    }

    private _buildError(result: MapType<any>): string {
        let errorMsg: string = this._validator$.getValue().errorMsg;
        Object.keys(result).forEach((key: string) => {
            errorMsg = errorMsg.split(key).join(result[key]);
        });
        return errorMsg;
    }
}

export interface IValidation {
    validators?: IValidator[];
    forcedError?: string;
}

export interface IValidationState {
    validators: ValidatorHandler[];
    forcedError: string | undefined;
    errors: string[];
    invalid: boolean;
}

export class Validation {

    private _valField: Field = <any>undefined;
    private _validation$: State<IValidationState> = <any>undefined;

    public invalid(): boolean {
        return this._validation$.getValue().invalid;
    }

    public invalid$(): Observable<boolean> {
        return this._validation$.select('invalid');
    }

    public errors(): string[] {
        return this._validation$.getValue().errors;
    }

    public errors$(): Observable<string[]> {
        return this._validation$.select('errors');
    }

    public forcedError(): string | undefined {
        return this._validation$.getValue().forcedError;
    }

    public forcedError$(): Observable<string | undefined> {
        return this._validation$.select('forcedError');
    }

    public setForcedError(error: string): void {
        this._validation$.updateKey('forcedError', error);
        // Todo: Call Update
    }

    public clearForcedError(): void {
        this._validation$.updateKey('forcedError', undefined);
        // Todo: Call Update
    }

    public addValidator(validator: IValidator): void {
        this._validation$.updateKey('validators', [
            ...this._validation$.getValue().validators,
            new ValidatorHandler(validator)
        ]);
        // Todo: Call Update
    }

    public removeValidator(id: string): void {
        this._validation$.updateKey('validators', [
            ...this._validation$.getValue().validators
                .filter((v: ValidatorHandler) => v.id !== id)
        ]);
        // Todo: Call Update
    }

    public setValidationInstance(): void {
        const state: IValidationState = this._validation$.getValue();
        state.validators.forEach((v: ValidatorHandler) => v.instanceRendered(this._valField));
    }

    protected _initValidation(validation: IValidation | undefined, field: Field): void {
        this._valField = field;
        const vali: IValidation = validation || <IValidation>{};
        this._validation$ = new State<IValidationState>({
            validators: (vali.validators || []).map((validator: IValidator) => new ValidatorHandler(validator)),
            forcedError: vali.forcedError,
            errors: !!vali.forcedError ? [vali.forcedError] : [],
            invalid: !!vali.forcedError
        });
    }

    protected _runValidation(context: IEffectContext): Observable<void> {
        if (this._shouldNotRunValidation()) {
            return of();
        }
        return forkJoin(
            ...this._validation$.getValue().validators
                .map((d: ValidatorHandler) => d.run(context))
        );
    }

    protected _updateValidation(): void {
        this._validation$.update({
            errors: this._calculateErrors(),
            invalid: this._isInvalid()
        });
    }

    private _calculateErrors(): string[] {
        const state: IValidationState = this._validation$.getValue();
        return [
            ...(state.forcedError ? [state.forcedError] : []),
            ...<string[]>state.validators
                .map((d: ValidatorHandler) => d.error())
                .filter((err: string | undefined) => !!err)
        ];
    }

    private _isInvalid(): boolean {
        const state: IValidationState = this._validation$.getValue();
        return !!state.forcedError ||
            state.validators.some((v: ValidatorHandler) => !!v.error) ||
            this._valField.getChildFields().some((f: Field) => f.invalid());
    }

    private _shouldNotRunValidation(): boolean {
        return !!this._validation$.getValue().forcedError ||
            this._validation$.getValue().validators.length === 0;
    }
}
