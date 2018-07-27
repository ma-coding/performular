import { Observable } from 'rxjs';

import { cloneDeep } from '../util/clone-deep';
import { State } from '../util/state';
import { ValueMode } from '../util/types/value-mode';
import { AbstractFieldModel } from './abstract-field-model';
import { AbstractModel } from './abstract-model';
import { ListFieldModelOptions } from './types/list-field-model-options';
import { ListFieldModelState } from './types/list-field-model-state';
import { ModelType } from '../builder/types/model-type';

export class ListFieldModel<ATTRS = any> extends AbstractFieldModel<
    ListFieldModelState<ATTRS>,
    ATTRS
> {
    protected _state$: State<ListFieldModelState<ATTRS>>;

    get childGenerator(): ListFieldModelState['childGenerator'] {
        return this._state$.select('childGenerator');
    }

    get childGenerator$(): Observable<ListFieldModelState['childGenerator']> {
        return this._state$.select$('childGenerator');
    }

    constructor(options: ListFieldModelOptions<ATTRS>) {
        super();
        const children: AbstractModel[] = options.values.map((val: any) => {
            return options.childGenerator(val);
        });
        children.forEach((child: AbstractModel) => child.setParent(this));
        const initialValue: any = this._buildValue(
            this._getRecursiveChildFields(children)
        );
        this._state$ = new State<ListFieldModelState>({
            ...this._initAbstractFieldModel(options),
            childGenerator: options.childGenerator,
            children: children,
            initialValue: initialValue,
            value: cloneDeep(initialValue),
            type: ModelType.LIST
        });
    }

    public setValue(value: any, emitUpdate: boolean = false): void {
        this.childFields
            .filter((child: AbstractFieldModel) => child.id in value)
            .forEach(
                (
                    child: AbstractFieldModel,
                    index: number,
                    arr: AbstractFieldModel[]
                ) => {
                    child.setValue(value[index], index === arr.length - 1);
                }
            );
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        this.childFields
            .filter((child: AbstractFieldModel) => child.id in value)
            .forEach(
                (
                    child: AbstractFieldModel,
                    index: number,
                    arr: AbstractFieldModel[]
                ) => {
                    child.patchValue(value[index], index === arr.length - 1);
                }
            );
    }

    public resetValue(emitUpdate: boolean = false): void {
        this.childFields.forEach(
            (
                child: AbstractFieldModel,
                index: number,
                arr: AbstractFieldModel[]
            ) => {
                child.resetValue(index === arr.length - 1);
            }
        );
    }

    public pushField(emitUpdate: boolean = true): void {
        this._updateChildren(
            [...this.children, this.childGenerator(null)],
            emitUpdate
        );
    }

    public popField(emitUpdate: boolean = true): void {
        const children: AbstractModel[] = this.children;
        children.pop();
        this._updateChildren(children, emitUpdate);
    }

    public removeFieldAtIndex(index: number): void {
        const children: AbstractModel[] = this.children;
        children.splice(index, 1);
        this._updateChildren(children, true);
    }

    public getIndex(field: AbstractFieldModel): number {
        return this.children.indexOf(field);
    }

    public conditionalValue(
        condition: (field: AbstractFieldModel) => boolean = (
            cond: AbstractFieldModel
        ): boolean => true
    ): any {
        if (!condition(this)) {
            return;
        }
        return this.childFields
            .map((child: AbstractFieldModel) => {
                return child.conditionalValue(condition);
            })
            .filter(Boolean);
    }

    protected _buildValue(childFields: AbstractFieldModel[]): any {
        return childFields.map((child: AbstractFieldModel) => {
            return child.value;
        });
    }

    private _updateChildren(
        children: AbstractModel[],
        emitUpdate: boolean
    ): void {
        this._state$.updateKey('children', [...children]);
        if (emitUpdate) {
            this._emitChildrenUpdate();
        }
    }

    private _emitChildrenUpdate(): void {
        this.children.forEach((child: AbstractModel) => child.setParent(this));
        this._createValue(ValueMode.SET, this._buildValue(this.childFields));
        this._updateParentValue([this], ValueMode.SET);
        this.runUpdate();
    }
}
