import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { createObservable } from '../misc';
import { State } from '../state';
import { EffectHandler, IEffect, IEffectContext, IOnEffect } from './effect';
import { Field } from './field';

export type IOnVisible<P = any> = IOnEffect<boolean | Observable<boolean>, P>;

export class VisibleHandler extends EffectHandler<IEffect, boolean | Observable<boolean>> {

    private _result$: BehaviorSubject<boolean>;

    get result$(): Observable<boolean> {
        return this._result$.asObservable();
    }

    get result(): boolean {
        return this._result$.getValue();
    }

    constructor(visible: IEffect) {
        super(visible);
        this._result$ = new BehaviorSubject(false);
    }

    public run(context: IEffectContext): Observable<void> {
        if (!this.runDetector.eval(context)) {
            return of();
        }
        return createObservable(
            this.instance.calculate(context, this.params)
        ).pipe(
            map((result: boolean) => this._result$.next(result))
        );
    }
}

export interface IVisibility {
    hides?: IEffect[];
    disables?: IEffect[];
    forcedHidden?: boolean;
    forcedDisabled?: boolean;
}

export interface IVisibilityState {
    hides: VisibleHandler[];
    disables: VisibleHandler[];
    hidden: boolean;
    disabled: boolean;
    forcedDisabled: boolean;
    forcedHidden: boolean;
}

export class Visibility {

    private _visField: Field = <any>undefined;
    private _visibility$: State<IVisibilityState> = <any>undefined;

    public forcedHidden(): boolean {
        return this._visibility$.getValue().forcedHidden;
    }

    public forcedHidden$(): Observable<boolean> {
        return this._visibility$.select('forcedHidden');
    }

    public forcedDisabled(): boolean {
        return this._visibility$.getValue().forcedDisabled;
    }

    public forcedDisabled$(): Observable<boolean> {
        return this._visibility$.select('forcedDisabled');
    }

    public hidden(): boolean {
        return this._visibility$.getValue().hidden;
    }

    public hidden$(): Observable<boolean> {
        return this._visibility$.select('hidden');
    }

    public disabled(): boolean {
        return this._visibility$.getValue().disabled;
    }

    public disabled$(): Observable<boolean> {
        return this._visibility$.select('disabled');
    }

    public addHide(effect: IEffect): void {
        this._addVis('hides', effect);
        // Todo: Call Update
    }

    public removeHide(id: string): void {
        this._removeVis('hides', id);
        // Todo: Call Update
    }

    public addDisable(effect: IEffect): void {
        this._addVis('disables', effect);
        // Todo: Call Update
    }

    public removeDisable(id: string): void {
        this._removeVis('disables', id);
        // Todo: Call Update
    }

    public setForcedDisable(value: boolean): void {
        this._visibility$.updateKey('forcedDisabled', value);
        // Todo: Call Update
    }

    public setForcedHidden(value: boolean): void {
        this._visibility$.updateKey('forcedHidden', value);
        // Todo: Call Update
    }

    protected _initVisibility(visibility: IVisibility | undefined, field: Field): void {
        this._visField = field;
        const visi: IVisibility = visibility || {};
        this._visibility$ = new State<IVisibilityState>({
            forcedHidden: visi.forcedHidden || false,
            forcedDisabled: visi.forcedDisabled || false,
            hidden: visi.forcedHidden || false,
            disabled: visi.forcedDisabled || false,
            hides: (visi.hides || []).map((vis: IEffect) => new VisibleHandler(vis)),
            disables: (visi.disables || []).map((vis: IEffect) => new VisibleHandler(vis)),
        });
    }

    protected _runVisibility(context: IEffectContext): Observable<void> {
        return this._runDisables(context).pipe(
            switchMap(() => this._runHides(context))
        );
    }

    protected _updateVisibility(): void {
        this._visibility$.updateKey('disabled', this._isDisabled());
        this._visibility$.updateKey('hidden', this._isHidden());
    }

    private _isDisabled(): boolean {
        const state: IVisibilityState = this._visibility$.getValue();
        return state.forcedDisabled || state.disables.some((d: VisibleHandler) => d.result);
    }

    private _isHidden(): boolean {
        const state: IVisibilityState = this._visibility$.getValue();
        return state.forcedHidden || state.hides.some((d: VisibleHandler) => d.result);
    }

    private _isParentDisabled(): boolean {
        const parent: Field | undefined = this._visField.getParentField();
        return parent ? parent.disabled() : false;
    }

    private _isParentHidden(): boolean {
        const parent: Field | undefined = this._visField.getParentField();
        return parent ? parent.hidden() : false;
    }

    private _shouldNotRunDisables(): boolean {
        return this._isParentDisabled() || this.forcedDisabled() ||
            this._visibility$.getValue().disables.length === 0;
    }

    private _shouldNotRunHides(): boolean {
        return this._isParentHidden() || this.forcedHidden() ||
            this._visibility$.getValue().hides.length === 0;
    }

    private _runDisables(context: IEffectContext): Observable<void> {
        return this._runVis(context, this._shouldNotRunDisables(), 'disables');
    }

    private _runHides(context: IEffectContext): Observable<void> {
        return this._runVis(context, this._shouldNotRunHides(), 'hides');
    }

    private _runVis(context: IEffectContext, shouldNotRun: boolean, key: 'hides' | 'disables'): Observable<void> {
        if (shouldNotRun) {
            return of();
        } else {
            return forkJoin(
                ...this._visibility$.getValue()[key]
                    .map((d: VisibleHandler) => d.run(context))
            );
        }
    }

    private _addVis(key: 'hides' | 'disables', effect: IEffect): void {
        this._visibility$.updateKey(key, [
            ...this._visibility$.getValue()[key],
            new VisibleHandler(effect)
        ]);
    }

    private _removeVis(key: 'hides' | 'disables', id: string): void {
        this._visibility$.updateKey(key, [
            ...this._visibility$.getValue()[key]
                .filter((h: VisibleHandler) => h.id !== id)
        ]);
    }

}
