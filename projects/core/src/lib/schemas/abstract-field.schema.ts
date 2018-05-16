import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ITriggerResult, TriggerAction, TriggerHandler, TriggerSchema } from '../handler/trigger.handler';
import { AbstractSchema, IAbstractSchema, IAbstractState, SchemaType } from './abstract.schema';

export interface IAbstractFieldSchema<BType = any> extends IAbstractSchema<BType> {
    id: string;
    effects?: TriggerSchema[];
}

export interface IAbstractFieldState<BType = any> extends IAbstractState<BType> {
    id: string;
    effects: TriggerHandler[];
    effectResults: ITriggerResult[];
    initValue: any;
    value: any;
    disabled: boolean;
    invalid: boolean;
    errorState: boolean;
    changed: boolean;
    dirty: boolean;
}

export abstract class AbstractFieldSchema<State extends IAbstractFieldState = any, BType = any> extends AbstractSchema<State, BType> {

    constructor(schema: IAbstractFieldSchema) {
        super(schema);
        this._initState = <any>{
            ...<IAbstractState>this._initState,
            id: schema.id,
            effects: [],
            effectResults: [],
            value: undefined,
            invalid: false,
            errorState: false,
            changed: false,
            dirty: false
        };
    }

    public getParentField(): AbstractFieldSchema | undefined {
        let schema: AbstractSchema<any> = this;
        let ret: AbstractFieldSchema = this;
        while (schema.get('parent')) {
            if (schema.get('parent') instanceof AbstractFieldSchema) {
                ret = schema.get('parent');
                break;
            }
            schema = schema.get('parent');
        }
        return ret !== this ? ret : undefined;
    }

    public getChildFields(fields: AbstractSchema[] = this.get('children')): AbstractFieldSchema[] {
        const erg: AbstractFieldSchema<any>[] = [];
        fields.forEach((field: AbstractSchema<any>) => {
            if (field instanceof AbstractFieldSchema) {
                erg.push(field);
            } else {
                erg.push(...this.getChildFields(field.get('children')));
            }
        });
        return erg;
    }

    public addEffect(effect: TriggerSchema): void {
        this._updateStore(<State>{
            effects: [
                ...this.get('effects'),
                new TriggerHandler(effect)
            ]
        });
        this.update([this.get('uuid')]);
    }

    public removeEffectWithId(id: string): void {
        const effects: TriggerHandler[] = this.get('effects');
        const effectResults: ITriggerResult[] = this.get('effectResults');
        this._updateStore(<State>{
            effects: effects.filter((effect: TriggerHandler) => effect.schema.id !== id),
            effectResults: effectResults.filter((res: ITriggerResult) => res.trigger.id !== id)
        });
        this.update([this.get('uuid')]);
    }

    public clearEffects(): void {
        this._updateStore(<any>{
            effects: [],
            effectResults: []
        });
        this.update([this.get('uuid')]);
    }

    public abstract setValue(value: any, emitUpdate: boolean): void;
    public abstract patchValue(value: any, emitUpdate: boolean): void;

    protected _updateValue(): void {
        const newValue: any = this._buildValue(this.getChildFields());
        this._updateStore(<State>{ value: newValue });
    }

    protected _updateParentValue(checklist: string[] = [(this.get('uuid') || '')]): void {
        const parent: AbstractFieldSchema | undefined = this.getParentField();
        if (parent) {
            parent._updateValue();
            parent._updateParentValue([...checklist, (parent.get('uuid') || '')]);
        } else {
            this.getRoot().update(checklist);
        }
    }

    protected _topDownUpdate(checklist: string[]): Observable<void> {
        const checked: boolean = checklist.indexOf(this.get('uuid')) >= 0;
        return this._updateEffects(checked).pipe(
            switchMap(() => this._updateChildren(checklist)),
            map(() => {
                if (this.get('type') === SchemaType.Control) {
                    this._bottomUpUpdate();
                }
            })
        );
    }

    protected _bottomUpUpdate(): void {
        const childFields: AbstractFieldSchema[] = this.getChildFields();
        const isAnyChildInvalid: boolean = childFields.some((child: AbstractFieldSchema) => child.get('invalid'));
        if (isAnyChildInvalid) {
            this._updateStore(<State>{
                invalid: true
            });
        }
        this._updateParent();
    }

    protected _updateEffects(checked: boolean): Observable<void> {
        return forkJoin(
            ...this.get('effects').map((effect: TriggerHandler) => {
                return effect.call(this, checked);
            }),
            of(false)
        ).pipe(
            map((results: ITriggerResult[]) => {
                results.pop();
                const newResults: ITriggerResult[] = results.map((res: ITriggerResult, index: number) => {
                    if (res.result === undefined) {
                        const lastResult: ITriggerResult | undefined = this.get('effectResults')
                            .find((reso: ITriggerResult) => {
                                return reso.trigger.id === res.trigger.id;
                            });
                        return lastResult && lastResult.result !== undefined ? lastResult : { trigger: res.trigger, result: undefined };
                    }
                    return res;
                });
                const parent: AbstractSchema | undefined = this.get('parent');
                this._updateStore(<State>{
                    effectResults: newResults,
                    invalid: !!results
                        .filter(this._filterByAction(TriggerAction.Error))
                        .find(this._findTriggerFlag),
                    disabled: !!results
                        .filter(this._filterByAction(TriggerAction.Disable))
                        .find(this._findTriggerFlag) || (parent ? parent.get('disabled') : false),
                    hidden: !!results
                        .filter(this._filterByAction(TriggerAction.Hide))
                        .find(this._findTriggerFlag) || (parent ? parent.get('hidden') : false)
                });
            })
        );
    }

    protected abstract _buildValue(childFields: AbstractSchema[]): any;

    private _filterByAction(action: TriggerAction): (res: ITriggerResult) => boolean {
        return (res: ITriggerResult): boolean => res.trigger.action === action;
    }

    private _findTriggerFlag(res: ITriggerResult): boolean {
        return res.result === true;
    }
}
