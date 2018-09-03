import {
    isAbstractFieldOptions,
    AbstractFieldOptions,
    AbstractField,
    BuildContext
} from './abstract-field';
import { GroupFieldOptionsWithOutName } from './group-field';
import { HashMap } from '../../internal/utils/types';
import { addToPath, buildEntities, FieldState } from './all';
import { FormState } from '../form';
import { EntityManager } from '../../internal/store/entity-store/entity-manager';

export interface ListFieldOptions extends AbstractFieldOptions<'LIST'> {
    childDefinition: GroupFieldOptionsWithOutName;
}

export function isListFieldOptions(value: any): value is ListFieldOptions {
    const isAbstract: boolean = isAbstractFieldOptions(value, 'LIST');
    return isAbstract && 'childDefinition' in value && value.childDefinition;
}

export class ListField extends AbstractField {
    public name: string;
    public childDefinition: GroupFieldOptionsWithOutName;
    public children: string[];
    public value: any;
    public id: string;

    constructor(options: ListFieldOptions, context: BuildContext) {
        super(options, context);

        this.childDefinition = options.childDefinition;
        this.name = context.name;
        this.id = addToPath(context.path, context.name);
        this.children = [];
        this.form.store.getState((state: FormState) => {
            this.value = this.valueBuilder(state.entities);
        });
        this.form.store.add(this);
        if (context.value && Array.isArray(context.value)) {
            this.children = context.value.map((value: any, index: number) => {
                this.childGenerator(value);
                return addToPath(this.id, index + '');
            });
        }
    }

    public push(value: any): void {
        this.childGenerator(value);
    }

    public removeAtIndex(index: number): void {
        this.form.store.transaction(() => {
            const manager: EntityManager<
                ListField
            > = this.form.store.getEntityManager<ListField>(this.id);
            manager.get((field: ListField) => {
                field.form.store.removeField(field.children[index]);
            });
        });
    }

    protected childGenerator(value: any): void {
        this.form.store.transaction(() => {
            const manager: EntityManager<
                ListField
            > = this.form.store.getEntityManager<ListField>(this.id);
            manager.get((field: ListField) => {
                // tslint:disable-next-line:no-unused-expression
                buildEntities(field.childDefinition, {
                    form: field.form,
                    name: field.children.length + '',
                    path: field.id,
                    value: value
                });

                const newPath: string = addToPath(
                    field.id,
                    field.children.length + ''
                );

                manager.update(
                    (state: ListField): ListField => {
                        state.children = [...state.children, newPath];
                        return state;
                    }
                );

                const childManager: EntityManager<
                    FieldState
                > = field.form.store.getEntityManager(newPath);
                childManager.get((childState: FieldState) => {
                    (<any>childState).updateParentValue();
                });
            });
        });
    }

    protected valueBuilder(entities: HashMap<any>): any {
        return this.children.map(
            (childPath: string) => entities[childPath].value
        );
    }
}
