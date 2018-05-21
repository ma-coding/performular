import { ElementRef } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { IValidationDefinition } from '../effects/validation/models/validation-definition.interface';
import { IValidatorDefinition } from '../effects/validation/models/validator-definition.interface';
import { IValidatorInternalResult } from '../effects/validation/models/validator-internal-result.interface';
import { ValidatorHandler } from '../effects/validation/validator-handler';
import { IVisibilityDefintion } from '../effects/visibility/models/visibility-definition.interface';
import { IVisibleDefinition } from '../effects/visibility/models/visible-definition.interface';
import { IVisibleInternalResult } from '../effects/visibility/models/visible-internal-result.interface';
import { VisibleMode } from '../effects/visibility/models/visible-mode.enum';
import { VisibleHandler } from '../effects/visibility/visible.handler';
import { IField } from '../field/models/field.interface';
import { IFieldProperty } from '../properties/models/field-property.interface';
import { IPropertyOptions } from '../properties/models/property-options.interface';
import { AbstractSchema } from './abstract.schema';
import { IFieldSchemaState } from './models/field-schema-state.interface';

export abstract class FieldSchema<State extends IFieldSchemaState<B> = any, B = any> extends AbstractSchema<State, B> {

    get id(): string {
        return this._get('id');
    }

    get value(): any {
        return this._get('value');
    }

    get invalid(): boolean {
        return this._get('invalid');
    }

    get forcedError(): string | undefined {
        return this._get('forcedError');
    }

    get validatorResults(): { [name: string]: IValidatorInternalResult | undefined } {
        return this._get('validatorResults');
    }

    get validators(): ValidatorHandler[] {
        return this._get('validators');
    }

    get forceHidden(): boolean {
        return this._get('forceHidden');
    }

    get disabled(): boolean {
        return this._get('disabled');
    }

    get forceDisabled(): boolean {
        return this._get('forceDisabled');
    }

    get visibles(): VisibleHandler[] {
        return this._get('visibles');
    }

    get visibleResults(): { [name: string]: IVisibleInternalResult | undefined } {
        return this._get('visibleResults');
    }

    constructor(property: IFieldProperty<any, any, any>, options: IPropertyOptions, value: any) {
        super(property, options, value);
        this._initState = <any>{
            validators: (this._getValidationProperty(property.validation).validators || [])
                .map((def: IValidatorDefinition) => new ValidatorHandler(def)),
            invalid: this._isForcedError(this._getValidationProperty(property.validation).forcedError),
            validatorResults: {},
            errors: this._getForcedErrors(this._getValidationProperty(property.validation).forcedError),
            forcedError: this._getValidationProperty(property.validation).forcedError,
            visibles: (this._getVisibilityProperty(property.visibility).visibles || [])
                .map((def: IVisibleDefinition) => new VisibleHandler(def)),
            disabled: this._getVisibilityProperty(property.visibility).forceDisabled || false,
            hidden: this._getVisibilityProperty(property.visibility).forceHidden || false,
            forceDisabled: this._getVisibilityProperty(property.visibility).forceDisabled || false,
            forceHidden: this._getVisibilityProperty(property.visibility).forceHidden || false,
            visibleResults: {},
            changed: false,
            dirty: false
        };
    }

    public setInstance(instance: IField, elementRef: ElementRef): void {
        super.setInstance(instance, elementRef);
        this.validators.forEach((validator: ValidatorHandler) => {
            validator.instanceRendered(this);
        });
    }

    public getParentField(): FieldSchema | undefined {
        let schema: AbstractSchema = this;
        while (schema.parent) {
            if (schema.parent instanceof FieldSchema) {
                return schema.parent;
            }
            schema = schema.parent;
        }
    }

    public getChildFields(fields: AbstractSchema[] = this.children): FieldSchema[] {
        const erg: FieldSchema[] = [];
        fields.forEach((field: AbstractSchema) => {
            if (field instanceof FieldSchema) {
                erg.push(field);
            } else {
                erg.push(...this.getChildFields(field.children));
            }
        });
        return erg;
    }

    public setForcedError(error: string): void {
        this._set(<any>{
            forcedError: error
        });
        this.update();
    }

    public clearForcedError(): void {
        this._set(<any>{
            forcedError: undefined
        });
        this.update();
    }

    public addValidator(definition: IValidatorDefinition): void {
        this._set(<any>{
            validators: [
                ...this.validators,
                new ValidatorHandler(definition)
            ]
        });
        this.update();
    }

    public removeValidator(name: string): void {
        this._set(<any>{
            validators: [
                ...this.validators
                    .filter((validator: ValidatorHandler) => validator.definition.validator !== name)
            ],
            validatorResults: Object.keys(this.validatorResults)
                .filter((key: string) => key !== name)
                .reduce((prev: {}, key: string) => {
                    prev[key] = this.validatorResults[key];
                    return prev;
                }, {})
        });
        this.update();
    }

    public clearValidators(): void {
        this._set(<any>{
            validators: [],
            validatorResults: {}
        });
        this.update();
    }

    public setForceDisabled(value: boolean): void {
        this._set(<any>{
            forceDisabled: value
        });
        this.update();
    }

    public setForceHidden(value: boolean): void {
        this._set(<any>{
            forceHidden: value
        });
        this.update();
    }

    public addVisible(definition: IVisibleDefinition): void {
        this._set(<any>{
            visibles: [
                ...this._get().visibles,
                new VisibleHandler(definition)
            ]
        });
        this.update();
    }

    public removeVisible(name: string): void {
        this._set(<any>{
            visibles: [
                ...this._get().visibles
                    .filter((visible: VisibleHandler) => visible.definition.visible !== name)
            ],
            visibleResults: Object.keys(this.visibleResults)
                .filter((key: string) => key !== name)
                .reduce((prev: {}, key: string) => {
                    prev[key] = this.visibleResults[key];
                    return prev;
                }, {})
        });
        this.update();
    }

    public clearVisibiles(): void {
        this._set(<any>{
            visibles: [],
            visibleResults: {}
        });
        this.update();
    }

    protected abstract _buildValue(children: AbstractSchema[]): any;

    protected _updateValidilityResults(checked: boolean): Observable<void> {
        if (this._isForcedError()) {
            return of();
        }
        const validators: ValidatorHandler[] = this.validators;
        if (validators.length === 0) {
            this._set(<any>{
                validatorResults: {}
            });
            return of();
        }
        return forkJoin(
            ...validators.map((validator: ValidatorHandler) => validator.run(this, checked)),
        ).pipe(
            map(this._upmergeResult('validatorResults'))
        );
    }

    protected _updateVisibilityResults(checked: boolean): Observable<void> {
        if (this._isParentDisabled() && this._isParentHidden()) {
            return of();
        }
        if (this.forceDisabled && this.forceHidden) {
            return of();
        }
        let visibles: VisibleHandler[] = this.visibles;
        if (this.forceDisabled) {
            visibles = visibles.filter((visble: VisibleHandler) => {
                return visble.definition.mode === VisibleMode.Hidden;
            });
        }
        if (this.forceHidden) {
            visibles = visibles.filter((visble: VisibleHandler) => {
                return visble.definition.mode === VisibleMode.Disabled;
            });
        }

        return forkJoin(
            visibles.map((visible: VisibleHandler) => visible.run(this, checked))
        ).pipe(
            // TODO CHECK IF THIS WORK !
            map(<any>this._upmergeResult('visibleResults'))
        );
    }

    protected _updateValidility(): void {
        this._set(<any>{
            invalid: this._analyzeInvalid(),
            errors: this._getErrorMessages()
        });
    }

    protected _updateVisibility(): void {
        this._set(<any>{
            disabled: this._analyzeDisabled(),
            hidden: this._analyzeHidden()
        });
    }

    private _analyzeDisabled(): boolean {
        return this._calculateVisibleFromResults(VisibleMode.Disabled) ||
            this._isParentDisabled() ||
            this.forceDisabled;
    }

    private _analyzeHidden(): boolean {
        return this._calculateVisibleFromResults(VisibleMode.Hidden) ||
            this._isParentHidden() ||
            this.forceHidden;
    }

    private _analyzeInvalid(): boolean {
        return this._isForcedError() ||
            this._anyChildIsInvalid() ||
            this._calculateInvalidFromResults();
    }

    private _calculateInvalidFromResults(): boolean {
        return Object.keys(this.validatorResults).some((name: string) => {
            const res: IValidatorInternalResult | undefined = this.validatorResults[name];
            return res ? res.error : false;
        });
    }

    private _calculateVisibleFromResults(mode: VisibleMode): boolean {
        return Object.keys(this.visibleResults)
            .filter((name: string) => {
                const res: IVisibleInternalResult | undefined = this.visibleResults[name];
                return res ? res.mode === mode : false;
            })
            .some((name: string) => {
                const res: IVisibleInternalResult | undefined = this.visibleResults[name];
                return res ? res.value : false;
            });
    }

    private _getErrorMessages(): string[] {
        if (this._isForcedError()) {
            return this._getForcedErrors();
        }
        return this._getResultErrors();
    }

    private _getResultErrors(): string[] {
        return Object.keys(this.validatorResults)
            .map((name: string) => {
                const res: IValidatorInternalResult | undefined = this.validatorResults[name];
                return res ? res.errorMsg : undefined;
            })
            .filter((msg: string | undefined) => msg !== undefined) as string[];
    }

    private _getValidationProperty(validationDefinition: IValidationDefinition | undefined): IValidationDefinition {
        return validationDefinition || {};
    }

    private _getVisibilityProperty(visibilityDefinition: IVisibilityDefintion | undefined): IVisibilityDefintion {
        return visibilityDefinition || {};
    }

    private _isForcedError(error: string | undefined = this.forcedError): boolean {
        return error !== undefined;
    }

    private _getForcedErrors(error: string | undefined = this.forcedError): string[] {
        return this._isForcedError(error) ? [<string>error] : [];
    }

    private _anyChildIsInvalid(): boolean {
        return this.getChildFields().some((child: FieldSchema) => child.invalid);
    }

    private _isParentDisabled(): boolean {
        const parentField: FieldSchema | undefined = this.getParentField();
        return parentField ? parentField.disabled : false;
    }

    private _isParentHidden(): boolean {
        const parentField: FieldSchema | undefined = this.getParentField();
        return parentField ? parentField.hidden : false;
    }

    private _upmergeResult<K extends keyof State, ResType extends State[K]>(resultKey: K):
        (results: (undefined | ResType)[]) => void {
        return (results: (undefined | ResType)[]): void => {
            const newResults: { [name: string]: ResType | undefined } =
                results.reduce((prev: any, current: undefined | ResType) => {
                    if (current) {
                        prev[(<any>current).name] = current;
                    }
                    return prev;
                }, this._get(resultKey));
            const upd: any = {};
            upd[resultKey] = newResults;
            this._set({
                ...upd
            });
        };
    }
}
