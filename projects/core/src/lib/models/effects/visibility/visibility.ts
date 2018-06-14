import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IPerformularTypes, TEffects } from '../../../utils/misc';
import { State } from '../../../utils/state';
import { AbstractField, IAbstractField } from '../../abstract-field';
import { IEffectContext, IEffectProperty } from '../effect';
import { VisibleHandler } from './visible';

export interface IVisibilityProperty<P extends IPerformularTypes = any> {
    hides?: TEffects<P>[];
    disables?: TEffects<P>[];
    forcedHidden?: boolean;
    forcedDisabled?: boolean;
}

export interface IVisibility {
    hides: VisibleHandler[];
    disables: VisibleHandler[];
    hidden: boolean;
    disabled: boolean;
    forcedDisabled: boolean;
    forcedHidden: boolean;
}

export function selectHides(state: IAbstractField): VisibleHandler[] {
    return state.hides;
}

export function selectDisables(state: IAbstractField): VisibleHandler[] {
    return state.disables;
}

export function selectHidden(state: IAbstractField): boolean {
    return state.hidden;
}

export function selectDisabled(state: IAbstractField): boolean {
    return state.disabled;
}

export function selectForcedDisabled(state: IAbstractField): boolean {
    return state.forcedDisabled;
}

export function selectForcedHidden(state: IAbstractField): boolean {
    return state.forcedHidden;
}

export class Visibility<ST extends IAbstractField = IAbstractField> {

    get forcedHidden(): boolean {
        return this._visibilityState$.get(selectForcedHidden);
    }

    get forcedHidden$(): Observable<boolean> {
        return this._visibilityState$.get$(selectForcedHidden);
    }

    get forcedDisabled(): boolean {
        return this._visibilityState$.get(selectForcedDisabled);
    }

    get forcedDisabled$(): Observable<boolean> {
        return this._visibilityState$.get$(selectForcedDisabled);
    }

    get hidden(): boolean {
        return this._visibilityState$.get(selectHidden);
    }

    get hidden$(): Observable<boolean> {
        return this._visibilityState$.get$(selectHidden);
    }

    get disabled(): boolean {
        return this._visibilityState$.get(selectDisabled);
    }

    get disabled$(): Observable<boolean> {
        return this._visibilityState$.get$(selectDisabled);
    }

    get disables(): VisibleHandler[] {
        return this._visibilityState$.get(selectDisables);
    }

    get disables$(): Observable<VisibleHandler[]> {
        return this._visibilityState$.get$(selectDisables);
    }

    get hides(): VisibleHandler[] {
        return this._visibilityState$.get(selectHides);
    }

    get hides$(): Observable<VisibleHandler[]> {
        return this._visibilityState$.get$(selectHides);
    }

    protected get _visibilityState$(): State<ST> {
        return (<any>this._visibilityField)._state$;
    }

    protected get _visibilityField(): AbstractField {
        return <AbstractField>(this as any);
    }

    public addHide(effect: IEffectProperty): void {
        this._addVis('hides', effect);
        this._visibilityField.update([this._visibilityField]);
    }

    public removeHide(id: string): void {
        this._removeVis('hides', id);
        this._visibilityField.update([this._visibilityField]);
    }

    public addDisable(effect: IEffectProperty): void {
        this._addVis('disables', effect);
        this._visibilityField.update([this._visibilityField]);
    }

    public removeDisable(id: string): void {
        this._removeVis('disables', id);
        this._visibilityField.update([this._visibilityField]);
    }

    public setForcedDisable(value: boolean): void {
        this._visibilityState$.updateKey('forcedDisabled', value);
        this._visibilityField.update([this._visibilityField]);
    }

    public setForcedHidden(value: boolean): void {
        this._visibilityState$.updateKey('forcedHidden', value);
        this._visibilityField.update([this._visibilityField]);
    }

    protected _initVisibility(visibility: IVisibilityProperty): IVisibility {
        return {
            forcedHidden: visibility.forcedHidden || false,
            forcedDisabled: visibility.forcedDisabled || false,
            hidden: visibility.forcedHidden || false,
            disabled: visibility.forcedDisabled || false,
            hides: (visibility.hides || []).map((vis: IEffectProperty) => new VisibleHandler(vis)),
            disables: (visibility.disables || []).map((vis: IEffectProperty) => new VisibleHandler(vis)),
        };
    }

    protected _runVisibility(context: IEffectContext): Observable<void> {
        return this._runDisables(context).pipe(
            switchMap(() => this._runHides(context))
        );
    }

    protected _updateVisibility(): void {
        this._visibilityState$.updateKey('disabled', this._isDisabled());
        this._visibilityState$.updateKey('hidden', this._isHidden());
    }

    private _isDisabled(): boolean {
        return this.forcedDisabled || this.disables.some((d: VisibleHandler) => d.result);
    }

    private _isHidden(): boolean {
        return this.forcedHidden || this.hides.some((d: VisibleHandler) => d.result);
    }

    private _isParentDisabled(): boolean {
        return this._visibilityField.parentField ? this._visibilityField.parentField.disabled : false;
    }

    private _isParentHidden(): boolean {
        return this._visibilityField.parentField ? this._visibilityField.parentField.hidden : false;
    }

    private _shouldNotRunDisables(): boolean {
        return this._isParentDisabled() || this.forcedDisabled || this.disables.length === 0;
    }

    private _shouldNotRunHides(): boolean {
        return this._isParentHidden() || this.forcedHidden || this.hides.length === 0;
    }

    private _runDisables(context: IEffectContext): Observable<void> {
        return this._runVis(context, this._shouldNotRunDisables(), 'disables');
    }

    private _runHides(context: IEffectContext): Observable<void> {
        return this._runVis(context, this._shouldNotRunHides(), 'hides');
    }

    private _runVis(context: IEffectContext, shouldNotRun: boolean, key: 'hides' | 'disables'): Observable<void> {
        if (shouldNotRun) {
            return of(undefined);
        } else {
            return forkJoin(
                ...this[key]
                    .map((d: VisibleHandler) => d.run(context))
            );
        }
    }

    private _addVis(key: 'hides' | 'disables', effect: IEffectProperty): void {
        this._visibilityState$.updateKey(key, [
            ...this[key],
            new VisibleHandler(effect)
        ]);
    }

    private _removeVis(key: 'hides' | 'disables', id: string): void {
        this._visibilityState$.updateKey(key, [
            ...this[key]
                .filter((h: VisibleHandler) => h.id !== id)
        ]);
    }
}
