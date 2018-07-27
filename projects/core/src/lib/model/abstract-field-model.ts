import { forkJoin, merge, Observable, of, combineLatest } from 'rxjs';
import { map, tap, skip } from 'rxjs/operators';

import { ValidationOptions } from '../handler/validation/types/validation-options';
import { Validation } from '../handler/validation/validation';
import { VisibilityOptions } from '../handler/visibility/types/visibility-options';
import { VisibilityType } from '../handler/visibility/types/visibility-type';
import { Visibility } from '../handler/visibility/visibility';
import { cloneDeep } from '../util/clone-deep';
import { isEqual } from '../util/is-equal';
import { ObjectType } from '../util/types/object-type';
import { RunContext } from '../util/types/run-context';
import { ValueMode } from '../util/types/value-mode';
import { AbstractModel } from './abstract-model';
import { AbstractFieldModelOptions } from './types/abstract-field-model-options';
import { AbstractFieldModelState } from './types/abstract-field-model-state';
import { IndexType } from '../builder/json-builder';
import { isString } from 'util';

export abstract class AbstractFieldModel<
    STATE extends AbstractFieldModelState<ATTRS> = any,
    ATTRS = any
> extends AbstractModel<STATE, ATTRS> {
    get visibilities(): AbstractFieldModelState['visibilities'] {
        return this._state$.select('visibilities');
    }

    get visibilities$(): Observable<AbstractFieldModelState['visibilities']> {
        return this._state$.select$('visibilities');
    }

    get disabled(): AbstractFieldModelState['disabled'] {
        return this._state$.select('disabled');
    }

    get disabled$(): Observable<AbstractFieldModelState['disabled']> {
        return this._state$.select$('disabled');
    }

    get forcedDisabled(): AbstractFieldModelState['forcedDisabled'] {
        return this._state$.select('forcedDisabled');
    }

    get forcedDisabled$(): Observable<
        AbstractFieldModelState['forcedDisabled']
    > {
        return this._state$.select$('forcedDisabled');
    }

    get hidden(): AbstractFieldModelState['hidden'] {
        return this._state$.select('hidden');
    }

    get hidden$(): Observable<AbstractFieldModelState['hidden']> {
        return this._state$.select$('hidden');
    }

    get forcedHidden(): AbstractFieldModelState['forcedHidden'] {
        return this._state$.select('forcedHidden');
    }

    get forcedHidden$(): Observable<AbstractFieldModelState['forcedHidden']> {
        return this._state$.select$('forcedHidden');
    }

    get validations(): AbstractFieldModelState['validations'] {
        return this._state$.select('validations');
    }

    get validations$(): Observable<AbstractFieldModelState['validations']> {
        return this._state$.select$('validations');
    }

    get invalid(): AbstractFieldModelState['invalid'] {
        return this._state$.select('invalid');
    }

    get invalid$(): Observable<AbstractFieldModelState['invalid']> {
        return this._state$.select$('invalid');
    }

    get forcedError(): AbstractFieldModelState['forcedError'] {
        return this._state$.select('forcedError');
    }

    get forcedError$(): Observable<AbstractFieldModelState['forcedError']> {
        return this._state$.select$('forcedError');
    }

    get errorState(): AbstractFieldModelState['errorState'] {
        return this.invalid && this.dirty;
    }

    get errorState$(): Observable<AbstractFieldModelState['errorState']> {
        return combineLatest(this.invalid$, this.dirty$).pipe(
            map((res: boolean[]) => res.every(Boolean))
        );
    }

    get errors(): AbstractFieldModelState['errors'] {
        return this._state$.select('errors');
    }

    get errors$(): Observable<AbstractFieldModelState['errors']> {
        return this._state$.select$('errors');
    }

    get initialValue(): AbstractFieldModelState['initialValue'] {
        return this._state$.select('initialValue');
    }

    get initialValue$(): Observable<AbstractFieldModelState['initialValue']> {
        return this._state$.select$('initialValue');
    }

    get value(): AbstractFieldModelState['value'] {
        return this._state$.select('value');
    }

    get value$(): Observable<AbstractFieldModelState['value']> {
        return this._state$.select$('value');
    }

    get changed(): AbstractFieldModelState['changed'] {
        return this._state$.select('changed');
    }

    get changed$(): Observable<AbstractFieldModelState['changed']> {
        return this._state$.select$('changed');
    }

    get dirty(): AbstractFieldModelState['dirty'] {
        return this._state$.select('dirty');
    }

    get dirty$(): Observable<AbstractFieldModelState['dirty']> {
        return this._state$.select$('dirty');
    }

    get childFields(): AbstractFieldModel[] {
        return this._getRecursiveChildFields(this.children);
    }

    get parentField(): AbstractFieldModel | undefined {
        let field: AbstractModel | undefined = this.parent;
        while (field) {
            if (field instanceof AbstractFieldModel) {
                return field;
            }
            field = field.parent;
        }
        return undefined;
    }

    get rootField(): AbstractFieldModel {
        let field: AbstractFieldModel = this;
        let jump: AbstractModel = this;
        while (jump.parent) {
            jump = <AbstractModel>field.parent;
            if (jump instanceof AbstractFieldModel) {
                field = jump;
            }
        }
        return field;
    }

    public abstract setValue(value: any, emitUpdate: boolean): void;
    public abstract patchValue(value: any, emitUpdate: boolean): void;
    public abstract resetValue(emitUpdate: boolean): void;

    public find(...path: IndexType[]): AbstractFieldModel | undefined {
        return path.reduce(
            (prev: AbstractFieldModel | undefined, current: IndexType) => {
                if (!prev) {
                    return;
                }
                if (isString(current)) {
                    return prev.childFields.find(
                        (c: AbstractFieldModel) => c.id === current
                    );
                } else {
                    return prev.childFields[current];
                }
            },
            this
        );
    }

    public addValidation(id: string, options: ValidationOptions): void {
        if (id in this.validations) {
            return;
        }
        this._state$.updateKey('validations', {
            [id]: new Validation(options)
        });
        this.runUpdate();
    }

    public removeValidation(id: string): void {
        if (!(id in this.validations)) {
            return;
        }
        const validations: ObjectType<Validation> = this._state$.select(
            'validations'
        );
        this._state$.updateKey('validations', {
            ...Object.keys(validations).reduce((prev: any, curr: string) => {
                if (curr === id) {
                    return prev;
                }
                prev[curr] = validations[curr];
                return prev;
            }, {})
        });
        this.runUpdate();
    }

    public addVisiblity(id: string, options: VisibilityOptions): void {
        if (!(id in this.visibilities)) {
            return;
        }
        this._state$.updateKey('visibilities', {
            [id]: new Visibility(options)
        });
        this.runUpdate();
    }

    public removeVisibility(id: string): void {
        if (!(id in this.visibilities)) {
            return;
        }
        const visibilities: ObjectType<Visibility> = this._state$.select(
            'visibilities'
        );
        this._state$.updateKey('validations', {
            ...Object.keys(visibilities).reduce((prev: any, curr: string) => {
                if (curr === id) {
                    return prev;
                }
                prev[curr] = visibilities[curr];
                return prev;
            }, {})
        });
        this.runUpdate();
    }

    public setForcedDisabled(disabled: boolean): void {
        this._state$.updateKey('forcedDisabled', disabled);
        this.runUpdate();
    }

    public setForcedHidden(hidden: boolean): void {
        this._state$.updateKey('forcedHidden', hidden);
        this.runUpdate();
    }

    public setForcedError(error: string | undefined): void {
        this._state$.updateKey('forcedError', error);
        this.runUpdate();
    }

    public updateValidationAndVisibility(
        context: RunContext
    ): Observable<void> {
        return forkJoin(
            ...Object.keys(this.validations).map((key: string) =>
                this.validations[key].run(context)
            ),
            ...Object.keys(this.visibilities).map((key: string) =>
                this.visibilities[key].run(context)
            ),
            of(undefined)
        ).pipe(map(() => {}));
    }

    protected abstract _buildValue(childFields: AbstractFieldModel[]): any;

    protected _updateParentValue(
        checklist: AbstractFieldModel[] = [this],
        mode: ValueMode
    ): void {
        const parent: AbstractFieldModel | undefined = this.parentField;
        if (parent) {
            parent._createValue(mode, parent._buildValue(parent.childFields));
            parent._updateParentValue([...checklist, parent], mode);
        } else {
            this._manualUpdates$.next(checklist);
        }
    }

    protected _onTreeDown(context: RunContext): Observable<void> {
        return this.updateValidationAndVisibility(context);
    }

    protected _onTreeUp(): void {
        this._updateValidation();
        this._updateVisibility();
    }

    protected _createValue(mode: ValueMode, value?: any): void {
        switch (mode) {
            case ValueMode.SET:
                return this._setValue(value);
            case ValueMode.RESET:
                return this._resetValue();
            case ValueMode.PATCH:
                return this._patchValue(value);
        }
    }

    protected _initAbstractFieldModel(
        options: AbstractFieldModelOptions
    ): AbstractFieldModelState {
        const validations: ObjectType<ValidationOptions> =
            options.validations || {};
        const visibilities: ObjectType<VisibilityOptions> =
            options.visibilities || {};
        return {
            ...this._initAbstractModel(options),
            validations: Object.keys(validations || {}).reduce(
                (prev: ObjectType<Validation>, curr: string) => {
                    return {
                        ...prev,
                        [curr]: new Validation(validations[curr])
                    };
                },
                {}
            ),
            visibilities: Object.keys(visibilities || {}).reduce(
                (prev: ObjectType<Visibility>, curr: string) => {
                    return {
                        ...prev,
                        [curr]: new Visibility(visibilities[curr])
                    };
                },
                {}
            ),
            forcedDisabled: options.forcedDisabled || false,
            forcedHidden: options.forcedHidden || false,
            forcedError: options.forcedError,
            disabled: options.forcedDisabled || false,
            hidden: options.forcedHidden || false,
            invalid: !!options.forcedError,
            errors: !!options.forcedError ? [options.forcedError] : [],
            errorState: false,
            value: undefined,
            initialValue: undefined,
            changed: false,
            dirty: false
        };
    }

    protected _getRecursiveChildFields(
        children: AbstractModel[] = this.children
    ): AbstractFieldModel[] {
        const erg: AbstractFieldModel[] = [];
        children.forEach((child: AbstractModel) => {
            if (child instanceof AbstractFieldModel) {
                erg.push(child);
            } else {
                erg.push(...this._getRecursiveChildFields(child.children));
            }
        });
        return erg;
    }

    protected _updateValidation(): void {
        this._state$.updateKey('errors', this._calculateErrors());
        this._state$.updateKey('invalid', this._isInvalid());
        this._state$.updateKey('errorState', this._isErrorState());
    }

    protected _updateVisibility(): void {
        const parent: AbstractFieldModel | undefined = this.parentField;
        if (parent) {
            parent._updateVisibility();
        }
        this._state$.updateKey('disabled', this._isDisabled());
        this._state$.updateKey('hidden', this._isHidden());
    }

    private _isDisabled(): boolean {
        return (
            this.forcedDisabled ||
            Object.keys(this.visibilities)
                .filter(
                    (k: string) =>
                        this.visibilities[k].type === VisibilityType.DISABLE
                )
                .some((k: string) => !!this.visibilities[k].result) ||
            this._isParentDisabled()
        );
    }

    private _isHidden(): boolean {
        return (
            this.forcedHidden ||
            Object.keys(this.visibilities)
                .filter(
                    (k: string) =>
                        this.visibilities[k].type === VisibilityType.HIDE
                )
                .some((k: string) => !!this.visibilities[k].result) ||
            this._isParentHidden()
        );
    }

    private _isParentDisabled(): boolean {
        return this.parentField ? this.parentField.disabled : false;
    }

    private _isParentHidden(): boolean {
        return this.parentField ? this.parentField.hidden : false;
    }

    private _calculateErrors(): string[] {
        return [
            ...(this.forcedError ? [this.forcedError] : []),
            ...(<string[]>Object.keys(this.validations)
                .map((valKey: string) => this.validations[valKey].error)
                .filter((err: string | undefined) => !!err))
        ];
    }

    private _isInvalid(): boolean {
        return (
            !!this.forcedError ||
            Object.keys(this.validations).some(
                (v: string) => !!this.validations[v].error
            ) ||
            this.childFields.some((f: AbstractFieldModel) => f.invalid)
        );
    }

    private _isErrorState(): boolean {
        return false; // Todo: add right implementation
    }

    private _setValue(value: any): void {
        this._state$.updateKey('value', value);
        this._state$.updateKey('changed', !isEqual(value, this.initialValue));
        this._state$.updateKey('dirty', true);
    }

    private _resetValue(): void {
        this._state$.updateKey('value', cloneDeep(this.initialValue));
        this._state$.updateKey('changed', false);
        this._state$.updateKey('dirty', false);
    }

    private _patchValue(value: any): void {
        this._state$.updateKey('value', value);
        this._state$.updateKey('initialValue', cloneDeep(value));
        this._state$.updateKey('changed', false);
        this._state$.updateKey('dirty', false);
    }
}
