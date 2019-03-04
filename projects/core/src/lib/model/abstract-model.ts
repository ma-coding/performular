import { forkJoin, Observable, Subject, merge, of } from 'rxjs';
import {
    buffer,
    concatMap,
    debounceTime,
    map,
    switchMap
} from 'rxjs/operators';

import { Modeler } from '../handler/modeler/modeler';
import { flatten } from '../util/flatten';
import { generateUUID } from '../util/generate-uuid';
import { State } from '../util/state';
import { RunContext } from '../util/types/run-context';
import { AbstractModelOptions } from './types/abstract-model-options';
import { AbstractModelState } from './types/abstract-model-state';
import { ModelType } from '../builder/types/model-type';
import { ObjectType } from '../util/types/object-type';
import { Effect } from '../handler/effect/effect';

export abstract class AbstractModel<
    STATE extends AbstractModelState<ATTRS> = any,
    ATTRS = any
> {
    protected abstract _state$: State<STATE>;

    protected _manualUpdates$: Subject<AbstractModel[]> = new Subject();

    get id(): AbstractModelState['id'] {
        return this._state$.select('id');
    }

    get id$(): Observable<AbstractModelState['id']> {
        return this._state$.select$('id');
    }

    get uuid(): AbstractModelState['uuid'] {
        return this._state$.select('uuid');
    }

    get uuid$(): Observable<AbstractModelState['uuid']> {
        return this._state$.select$('uuid');
    }

    get model(): AbstractModelState['model']['target'] {
        return this._state$.select('model').target;
    }

    get model$(): Observable<AbstractModelState['model']['target']> {
        return this._state$
            .select$('model')
            .pipe(map((modeler: Modeler) => modeler.target));
    }

    get modelDef(): AbstractModelState['model'] {
        return this._state$.select('model');
    }

    get modelDef$(): Observable<AbstractModelState['model']> {
        return this._state$.select$('model');
    }

    get attrs(): AbstractModelState<ATTRS>['attrs'] {
        return this._state$.select('attrs');
    }

    get attrs$(): Observable<AbstractModelState<ATTRS>['attrs']> {
        return this._state$.select$('attrs');
    }

    get hidden(): AbstractModelState['hidden'] {
        return this._state$.select('hidden');
    }

    get hidden$(): Observable<AbstractModelState['hidden']> {
        return this._state$.select$('hidden');
    }

    get children(): AbstractModelState['children'] {
        return this._state$.select('children');
    }

    get children$(): Observable<AbstractModelState['children']> {
        return this._state$.select$('children');
    }

    get parent(): AbstractModelState['parent'] {
        return this._state$.select('parent');
    }

    get parent$(): Observable<AbstractModelState['parent']> {
        return this._state$.select$('parent');
    }

    get instance(): AbstractModelState['instance'] {
        return this._state$.select('instance');
    }

    get instance$(): Observable<AbstractModelState['instance']> {
        return this._state$.select$('instance');
    }

    get elementRef(): AbstractModelState['elementRef'] {
        return this._state$.select('elementRef');
    }

    get elementRef$(): Observable<AbstractModelState['elementRef']> {
        return this._state$.select$('elementRef');
    }

    get actions(): AbstractModelState['actions'] {
        return this._state$.select('actions');
    }

    get actions$(): Observable<AbstractModelState['actions']> {
        return this._state$.select$('actions');
    }

    get root(): AbstractModel {
        let field: AbstractModel = this;
        while (field.parent) {
            field = field.parent;
        }
        return field;
    }

    get all(): AbstractModel[] {
        return [
            this,
            ...flatten(this.children.map((child: AbstractModel) => child.all))
        ];
    }

    get updates$(): Observable<void> {
        return this._getUpdates$();
    }

    get reactions$(): Observable<void> {
        return this.children$.pipe(
            switchMap((children: AbstractModel[]) =>
                merge(
                    this._getActions(),
                    ...children.map((child: AbstractModel) => child.reactions$)
                )
            )
        );
    }

    public setParent(parent: AbstractModel): void {
        this._state$.updateKey('parent', parent);
    }

    public setInstance(instance: any, elementRef: HTMLElement): void {
        this._state$.updateKey('elementRef', elementRef);
        this._state$.updateKey('instance', instance);
    }

    public runUpdate(models: AbstractModel[] = [this]): void {
        this.root._manualUpdates$.next(models);
    }
    protected abstract _onTreeDown(context: RunContext): Observable<void>;
    protected abstract _onTreeUp(): void;
    protected abstract _buildRunContext(checkedFields: any[]): RunContext;

    protected _treeUp(): void {
        this._onTreeUp();
        const p: AbstractModel | undefined = this.parent;
        if (p) {
            p._treeUp();
        }
    }

    protected _treeDown(checkedFields: AbstractModel[]): Observable<void> {
        const context: RunContext = this._buildRunContext(checkedFields);
        const children: AbstractModel[] = this.children;
        if (children.length === 0) {
            return this._onTreeDown(context).pipe(map(() => this._treeUp()));
        }
        return this._onTreeDown(context).pipe(
            concatMap(() =>
                forkJoin(
                    ...children.map((c: AbstractModel) =>
                        c._treeDown(checkedFields)
                    )
                )
            )
        );
    }

    protected _initAbstractModel(
        options: AbstractModelOptions
    ): AbstractModelState {
        return {
            children: [],
            uuid: generateUUID(),
            model: new Modeler(options.model),
            attrs: options.attrs,
            id: options.id,
            hidden: false,
            elementRef: undefined,
            instance: undefined,
            type: ModelType.CONTROL,
            actions: Object.keys(options.actions || {}).reduce(
                (prev: ObjectType<Effect>, next: string) => {
                    return {
                        ...prev,
                        // tslint:disable-next-line:no-non-null-assertion
                        [next]: new Effect(options.actions![next])
                    };
                },
                {}
            )
        };
    }

    private _getActions(): Observable<void> {
        const obs: Observable<void>[] = Object.keys(this.actions).map(
            (k: string) => this.actions[k].runEffect(this)
        );
        return merge(...obs, of(undefined));
    }

    private _getUpdates$(): Observable<void> {
        return this._getUpdateHandler(this.root._manualUpdates$);
    }

    private _getUpdateHandler(
        obs: Observable<AbstractModel[]>
    ): Observable<void> {
        return obs.pipe(
            buffer(obs.pipe(debounceTime(200))),
            map(flatten),
            concatMap((checkList: AbstractModel[]) => this._treeDown(checkList))
        );
    }
}
