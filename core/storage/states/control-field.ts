import {
    isAbstractFieldOptions,
    AbstractFieldOptions,
    AbstractField,
    BuildContext
} from './abstract-field';
import { HashMap } from '../../internal/utils/types';
import { FieldState, addToPath } from './all';

export interface ControlFieldOptions extends AbstractFieldOptions<'CONTROL'> {
    label: string;
    defaultValue?: any;
    focus?: boolean;
    tabIndex?: number;
}

export function isControlFieldOptions(
    value: any
): value is ControlFieldOptions {
    const isAbstract: boolean = isAbstractFieldOptions(value, 'CONTROL');
    return isAbstract && 'label' in value && value.label;
}

export class ControlField extends AbstractField {
    public name: string;
    public id: string;
    public value: any;
    public children: string[];
    public label: string;
    public defaultValue: any | null;
    public focus: boolean;
    public tabIndex: number;

    constructor(options: ControlFieldOptions, context: BuildContext) {
        super(options, context);
        this.id = addToPath(context.path, context.name);
        this.name = context.name;
        this.children = [];
        this.focus = options.focus || false;
        this.tabIndex = options.tabIndex || 0;
        this.label = options.label;
        this.defaultValue = options.defaultValue || null;
        this.value = context.value || this.defaultValue;

        context.form.store.add(this);
    }

    protected valueBuilder(entities: HashMap<FieldState>): any {
        throw new Error('ControlField Valuebuilder should never be called!');
    }
}
