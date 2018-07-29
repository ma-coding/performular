import { cloneDeep } from '../util/clone-deep';
import { State } from '../util/state';
import { AbstractFieldModel } from './abstract-field-model';
import { AbstractModel } from './abstract-model';
import { GroupFieldModelOptions } from './types/group-field-model-options';
import { GroupFieldModelState } from './types/group-field-model-state';
import { ModelType } from '../builder/types/model-type';

export class GroupFieldModel<ATTRS = any> extends AbstractFieldModel<
    GroupFieldModelState<ATTRS>,
    ATTRS
> {
    protected _state$: State<GroupFieldModelState<ATTRS>>;

    constructor(options: GroupFieldModelOptions<ATTRS>) {
        super();
        options.children.forEach((child: AbstractModel) =>
            child.setParent(this)
        );
        const initialValue: any = this._buildValue(
            this._getRecursiveChildFields(options.children)
        );
        this._state$ = new State<GroupFieldModelState>({
            ...this._initAbstractFieldModel(options),
            children: options.children,
            initialValue: initialValue,
            value: cloneDeep(initialValue),
            type: ModelType.GROUP
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
                    child.setValue(value[child.id], index === arr.length - 1);
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
                    child.patchValue(value[child.id], index === arr.length - 1);
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

    public conditionalValue(
        condition: (field: AbstractFieldModel) => boolean = (
            cond: AbstractFieldModel
        ): boolean => true
    ): any {
        if (!condition(this)) {
            return;
        }
        return this.childFields.reduce(
            (prev: {}, child: AbstractFieldModel) => {
                const condChildValue: any = child.conditionalValue(condition);
                return {
                    ...prev,
                    ...(condChildValue ? { [child.id]: condChildValue } : {})
                };
            },
            {}
        );
    }

    protected _buildValue(childFields: AbstractFieldModel[]): any {
        return childFields.reduce((prev: {}, child: AbstractFieldModel) => {
            return {
                ...prev,
                [child.id]: child.value
            };
        }, {});
    }
}
