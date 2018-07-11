import { forkJoin, merge, Observable, Subject } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { Effects } from '../effects/effects';
import { Transformer } from '../transformer/transformer';
import { generateUUID } from '../utils/generate-uuid';
import { State } from '../utils/state';
import { RunContext } from '../utils/types/run-context';
import { ValueMode } from '../value/types/value-mode';
import { Value } from '../value/value';
import { AbstractFieldOptions } from './types/abstract-field-options';
import { AbstractFieldState } from './types/abstract-field-state';

export abstract class AbstractField<T extends AbstractFieldState = any> {

    private _manualUpdates$: Subject<AbstractField[]> = new Subject();
    protected _transformer: Transformer | undefined;
    protected abstract _fieldApi: State<T>;
    protected abstract _valueApi: Value;
    public effectsApi: Effects;

    get id(): string {
        return this._fieldApi._select('id');
    }

    get parent(): AbstractField | undefined {
        return this._fieldApi._select('parent');
    }

    get parent$(): Observable<AbstractField | undefined> {
        return this._fieldApi._select$('parent');
    }

    get value(): any {
        return this._valueApi.value;
    }

    get root(): AbstractField {
        let root: AbstractField = this;
        while (root.parent) {
            root = root.parent;
        }
        return root;
    }

    get updates$(): Observable<AbstractField[]> {
        return merge(
            this.getUpdates$().pipe(
                map(() => [this])
            ),
            this._manualUpdates$
        );
    }

    constructor(options: AbstractFieldOptions) {
        this._transformer = options.transformer ? new Transformer(options.transformer) : undefined;
        this.effectsApi = new Effects(options.effects || {});
    }

    public setParent(parent: AbstractField): void {
        this._fieldApi._updateKey('parent', parent);
    }

    public abstract getUpdates$(): Observable<void>;
    public abstract setValue(value: any): void;
    public abstract patchValue(value: any): void;
    public abstract resetValue(): void;

    protected abstract _buildValue(children?: AbstractField[]): any;
    protected abstract _forEachChildren(cb: (child: AbstractField) => void): any;

    protected _initAbstract(options: AbstractFieldOptions): AbstractFieldState {
        return {
            id: options.id,
            uuid: generateUUID(),
            parent: undefined
        };
    }

    protected _updateParentValue(checklist: AbstractField[] = [this], mode: ValueMode): void {
        const parent: AbstractField | undefined = this.parent;
        if (parent) {
            parent._valueApi.updateValue(mode, parent._buildValue());
            parent._updateParentValue([...checklist, parent], mode);
        } else {
            this._manualUpdates$.next(checklist);
        }
    }

    private _treeUp(): void {
        this.effectsApi.updateFlags();
        const p: AbstractField | undefined = this.parent;
        if (p) {
            p._treeUp();
        }
    }

    private _treeDown(checkedFields: AbstractField[]): Observable<void> {
        const context: RunContext = this._buildRunContext(checkedFields);
        const children: AbstractField[] = this._getChildren();
        if (children.length === 0) {
            return this.effectsApi.evaluate(context).pipe(
                map(() => this._treeUp())
            );
        }
        return this.effectsApi.evaluate(context).pipe(
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
        this._forEachChildren((child: AbstractField) => {
            children.push(child);
        });
        return children;
    }
}
