import { forkJoin, Observable, Subject } from 'rxjs';
import { buffer, concatMap, debounceTime, map } from 'rxjs/operators';

import { Effects } from '../effects/effects';
import { DefaultTransformerOptions } from '../transformer/default-transformer';
import { Transformer } from '../transformer/transformer';
import { flatten } from '../utils/flatten';
import { generateUUID } from '../utils/generate-uuid';
import { State } from '../utils/state';
import { ObjectType } from '../utils/types/object-type';
import { RunContext } from '../utils/types/run-context';
import { ValidationOptions } from '../validation/types/validation-options';
import { Validation } from '../validation/validation';
import { ValueMode } from '../value/types/value-mode';
import { Value } from '../value/value';
import { VisibilityOptions } from '../visiblity/types/visibility-options';
import { Visibility } from '../visiblity/visibility';
import { AbstractFieldOptions } from './types/abstract-field-options';
import { AbstractFieldState } from './types/abstract-field-state';

export abstract class AbstractField<T extends AbstractFieldState = any> extends State<T> {

    private _updateSubject: Subject<AbstractField[]> = new Subject<AbstractField[]>();
    protected abstract _valueState: Value;
    protected _effectsState: Effects;

    get parent(): AbstractField | undefined {
        return this.select('parent');
    }

    get parent$(): Observable<AbstractField | undefined> {
        return this.select$('parent');
    }

    get root(): AbstractField {
        let root: AbstractField = this;
        while (root.parent) {
            root = root.parent;
        }
        return root;
    }

    get value(): any {
        return this.select('transformer').executeFrom(this._valueState.select('value'));
    }

    get value$(): any {
        return this._valueState.select$('value').pipe(map(this.select('transformer').executeFrom));
    }

    get initialValue(): any {
        return this.select('transformer').executeFrom(this._valueState.select('initialValue'));
    }

    get initialValue$(): any {
        return this._valueState.select$('initialValue').pipe(map(this.select('transformer').executeFrom));
    }

    get changed(): boolean {
        return this._valueState.select('changed');
    }

    get changed$(): Observable<boolean> {
        return this._valueState.select$('changed');
    }

    get dirty(): boolean {
        return this._valueState.select('dirty');
    }

    get dirty$(): Observable<boolean> {
        return this._valueState.select$('dirty');
    }

    get validations(): ObjectType<Validation> {
        return this._effectsState.select('validations');
    }

    get validations$(): Observable<ObjectType<Validation>> {
        return this._effectsState.select$('validations');
    }

    get visibilities(): ObjectType<Visibility> {
        return this._effectsState.select('visibilities');
    }

    get visibilities$(): Observable<ObjectType<Visibility>> {
        return this._effectsState.select$('visibilities');
    }

    get forcedDisable(): boolean {
        return this._effectsState.select('forcedDisable');
    }

    get forcedDisable$(): Observable<boolean> {
        return this._effectsState.select$('forcedDisable');
    }

    get disabled(): boolean {
        return this._effectsState.select('disabled');
    }

    get disabled$(): Observable<boolean> {
        return this._effectsState.select$('disabled');
    }

    get forcedHidden(): boolean {
        return this._effectsState.select('forcedHidden');
    }

    get forcedHidden$(): Observable<boolean> {
        return this._effectsState.select$('forcedHidden');
    }

    get hidden(): boolean {
        return this._effectsState.select('hidden');
    }

    get hidden$(): Observable<boolean> {
        return this._effectsState.select$('hidden');
    }

    get forcedError(): string | undefined {
        return this._effectsState.select('forcedError');
    }

    get forcedError$(): Observable<string | undefined> {
        return this._effectsState.select$('forcedError');
    }

    get invalid(): boolean {
        return this._effectsState.select('invalid');
    }

    get invalid$(): Observable<boolean> {
        return this._effectsState.select$('invalid');
    }

    get errors(): string[] {
        return this._effectsState.select('errors');
    }

    get errors$(): Observable<string[]> {
        return this._effectsState.select$('errors');
    }

    get updates$(): Observable<void> {
        return this._updateSubject.pipe(
            // tslint:disable-next-line:no-magic-numbers
            buffer(this._updateSubject.pipe(debounceTime(200))),
            map(flatten),
            concatMap((checkList: AbstractField[]) => this._treeDown(checkList))
        );
    }

    constructor(options: AbstractFieldOptions) {
        super(<T>{
            name: options.name,
            uuid: generateUUID(),
            transformer: new Transformer(options.transformer || DefaultTransformerOptions),
            parent: options.parent
        });
        this._effectsState = new Effects(options.effects || {});
    }

    public abstract forEachChildren(cb: (child: AbstractField) => void): void;

    public abstract setValue(value: any): void;
    public abstract patchValue(value: any): void;
    public abstract resetValue(): void;

    public addValidation(id: string, options: ValidationOptions): void {
        this._effectsState.addValidation(id, options);
    }

    public removeValidation(id: string): void {
        this._effectsState.removeValidation(id);
    }

    public addVisibility(id: string, options: VisibilityOptions): void {
        this._effectsState.addVisiblity(id, options);
    }

    public removeVisibility(id: string): void {
        this._effectsState.removeVisibility(id);
    }

    public setForcedDisable(value: boolean): void {
        this._effectsState.setForcedDisabled(value);
    }

    public setForcedHidden(value: boolean): void {
        this._effectsState.setForcedHidden(value);
    }

    public setForcedError(value: string): void {
        this._effectsState.setForcedError(value);
    }

    public doUpdate(checklist: AbstractField<any>[] = [this]): void {
        this.root._updateSubject.next(checklist);
    }

    protected abstract _buildValue(children?: AbstractField[]): any;

    protected _updateParentValue(checklist: AbstractField[] = [this], mode: ValueMode): void {
        const parent: AbstractField | undefined = this.parent;
        if (parent) {
            parent._valueState.updateValue(mode, parent._buildValue());
            parent._updateParentValue([...checklist, parent], mode);
        } else {
            this.doUpdate(checklist);
        }
    }

    private _updateFlags(): void {
        this._effectsState.updateFlags();
    }

    private _treeUp(): void {
        this._updateFlags();
        const p: AbstractField | undefined = this.parent;
        if (p) {
            p._treeUp();
        }
    }

    private _treeDown(checkedFields: AbstractField[]): Observable<void> {
        const context: RunContext = this._buildRunContext(checkedFields);
        const children: AbstractField[] = this._getChildren();
        if (children.length === 0) {
            return this._effectsState.evaluate(context).pipe(
                map(() => this._treeUp())
            );
        }
        return this._effectsState.evaluate(context).pipe(
            concatMap(() =>
                forkJoin(
                    ...children.map((c: AbstractField) => c._treeDown(checkedFields))
                )
            )
        );
    }

    private _buildRunContext(checkedFields: AbstractField[]): RunContext {
        return {
            checkedFields: checkedFields,
            checked: checkedFields.indexOf(this) >= 0,
            field: this
        };
    }

    private _getChildren(): AbstractField[] {
        const children: AbstractField[] = [];
        this.forEachChildren((child: AbstractField) => {
            children.push(child);
        });
        return children;
    }
}
