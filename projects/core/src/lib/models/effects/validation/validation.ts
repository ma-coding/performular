import { forkJoin, Observable, of } from 'rxjs';

import { IPerformularTypes, TEffects } from '../../../utils/misc';
import { State } from '../../../utils/state';
import { AbstractField, IAbstractField } from '../../abstract-field';
import { IEffectContext } from '../effect';
import { IValidatorProperty, ValidatorHandler } from './validator';

export interface IValidationProperty<P extends IPerformularTypes = any> {
    validators?: TEffects<P>[];
    forcedError?: string;
}

export interface IValidation {
    validators: ValidatorHandler[];
    forcedError: string | undefined;
    errors: string[];
    invalid: boolean;
}

export function selectValidators(state: IAbstractField): ValidatorHandler[] {
    return state.validators;
}

export function selectForcedError(state: IAbstractField): string | undefined {
    return state.forcedError;
}

export function selectErrors(state: IAbstractField): string[] {
    return state.errors;
}

export function selectInvalid(state: IAbstractField): boolean {
    return state.invalid;
}

export abstract class Validation<ST extends IAbstractField = IAbstractField> {

    get validators(): ValidatorHandler[] {
        return this._validationState$.get(selectValidators);
    }

    get validators$(): Observable<ValidatorHandler[]> {
        return this._validationState$.get$(selectValidators);
    }

    get forcedError(): string | undefined {
        return this._validationState$.get(selectForcedError);
    }

    get forcedError$(): Observable<string | undefined> {
        return this._validationState$.get$(selectForcedError);
    }

    get errors(): string[] {
        return this._validationState$.get(selectErrors);
    }

    get errors$(): Observable<string[]> {
        return this._validationState$.get$(selectErrors);
    }

    get invalid(): boolean {
        return this._validationState$.get(selectInvalid);
    }

    get invalid$(): Observable<boolean> {
        return this._validationState$.get$(selectInvalid);
    }

    protected get _validationState$(): State<ST> {
        return (<any>this._validationField)._state$;
    }

    protected get _validationField(): AbstractField {
        return <AbstractField>(this as any);
    }

    public setForcedError(error: string): void {
        this._validationState$.updateKey('forcedError', error);
        this._validationField.update([this._validationField]);
    }

    public clearForcedError(): void {
        this._validationState$.updateKey('forcedError', undefined);
        this._validationField.update([this._validationField]);
    }

    public addValidator(validator: IValidatorProperty): void {
        const validatorHandler: ValidatorHandler = new ValidatorHandler(validator);
        this._validationState$.updateKey('validators', [
            ...this.validators,
            validatorHandler
        ]);
        validatorHandler.instanceRendered(this._validationField);
        this._validationField.update([this._validationField]);
    }

    public removeValidator(id: string): void {
        const validator: ValidatorHandler | undefined = this.validators.find((val: ValidatorHandler) => val.id === id);
        if (validator) {
            validator.onRemoveValidator(this._validationField);
        }
        this._validationState$.updateKey('validators', [
            ...this.validators
                .filter((v: ValidatorHandler) => v.id !== id)
        ]);
        this._validationField.update([this._validationField]);
    }

    protected _setValidationInstance(): void {
        this.validators.forEach((v: ValidatorHandler) => v.instanceRendered(this._validationField));
    }

    protected _initValidation(validation: IValidationProperty): IValidation {
        return {
            validators: (validation.validators || []).map((validator: IValidatorProperty) => new ValidatorHandler(validator)),
            forcedError: validation.forcedError,
            errors: !!validation.forcedError ? [validation.forcedError] : [],
            invalid: !!validation.forcedError
        };
    }

    protected _runValidation(context: IEffectContext): Observable<void> {
        if (this._shouldNotRunValidation()) {
            return of(undefined);
        }
        return forkJoin(
            ...this.validators
                .map((d: ValidatorHandler) => d.run(context))
        );
    }

    protected _updateValidation(): void {
        this._validationState$.updateKey('errors', this._calculateErrors());
        this._validationState$.updateKey('invalid', this._isInvalid());
    }

    private _calculateErrors(): string[] {
        return [
            ...(this.forcedError ? [this.forcedError] : []),
            ...<string[]>this.validators
                .map((d: ValidatorHandler) => d.error)
                .filter((err: string | undefined) => !!err)
        ];
    }

    private _isInvalid(): boolean {
        return !!this.forcedError ||
            this.validators.some((v: ValidatorHandler) => !!v.error) ||
            this._validationField.childFields.some((f: AbstractField) => f.invalid);
    }

    private _shouldNotRunValidation(): boolean {
        return !!this.forcedError || this.validators.length === 0;
    }

}
