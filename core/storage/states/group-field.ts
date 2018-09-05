import { ExclueKeys, HashMap } from '../../memory-store/utils/types';
import { FormState } from '../form';
import {
    AbstractField,
    AbstractFieldOptions,
    BuildContext,
    isAbstractFieldOptions
} from './abstract-field';
import { addToPath, buildEntities } from './all';
import { ControlFieldOptions } from './control-field';
import { ListFieldOptions } from './list-field';

export type GroupFieldOptionsWithOutName = ExclueKeys<
    GroupFieldOptions,
    'name'
>;

export interface GroupFieldOptions extends AbstractFieldOptions<'GROUP'> {
    name: string;
    layout: any;
    children: {
        [name: string]:
            | ControlFieldOptions
            | ListFieldOptions
            | GroupFieldOptionsWithOutName;
    };
}

export function isGroupFieldOptions(value: any): value is GroupFieldOptions {
    const isAbstract: boolean = isAbstractFieldOptions(value, 'GROUP');
    return isAbstract && 'children' in value && value.children;
}

export class GroupField extends AbstractField {
    public name: string;
    public children: string[];
    public id: string;
    public value: any;
    public layout: any;

    constructor(options: GroupFieldOptionsWithOutName, context: BuildContext) {
        super(options, context);
        this.id = addToPath(context.path, context.name);
        this.name = context.name;
        this.layout = options.layout;
        this.children = this._buildChildren(options, context);
        this.form.store.getState((state: FormState) => {
            this.value = this.valueBuilder(state.entities);
        });
        context.form.store.add(this);
    }

    protected valueBuilder(entities: HashMap<any>): any {
        return this.children.reduce((prev: any, childPath: string) => {
            return {
                ...prev,
                [entities[childPath].name]: entities[childPath].value
            };
        }, {});
    }

    protected _buildChildren(
        options: GroupFieldOptionsWithOutName,
        context: BuildContext
    ): string[] {
        return Object.keys(options.children).map((childName: string) => {
            buildEntities(options.children[childName], {
                form: context.form,
                name: childName,
                path: this.id,
                value:
                    childName in context.value ? context.value[childName] : null
            });
            return addToPath(this.id, childName);
        });
    }
}
