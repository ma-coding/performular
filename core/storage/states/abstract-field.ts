import { EntityClass } from '../../internal/store/entity-store/entity';
import { EntityManager } from '../../internal/store/entity-store/entity-manager';
import { HashMap } from '../../memory-store/utils/types';
import { Form, FormState } from '../form';
import { FieldState } from './all';
import { ValidationsOptions } from './types/validations';
import { VisibilitiesOptions } from './types/visibilities';

export type FieldTypes = 'CONTROL' | 'GROUP' | 'LIST';

export interface AbstractFieldOptions<T extends FieldTypes>
    extends ValidationsOptions,
        VisibilitiesOptions {
    type: T;
}

export function isAbstractFieldOptions<T extends FieldTypes>(
    value: any,
    type: T
): value is AbstractFieldOptions<T> {
    return !!value && value.type === type;
}

export interface BuildContext {
    path: string;
    name: string;
    value: any;
    form: Form;
}

export abstract class AbstractField extends EntityClass {
    public instance?: any;
    public elementRef?: any;
    public forcedError?: string;
    public forcedDisabled?: boolean;
    public forcedHidden?: boolean;
    public form: Form;

    public abstract name: string;
    public abstract value: any;
    public abstract children: string[];

    constructor(options: AbstractFieldOptions<any>, context: BuildContext) {
        super();
        this.form = context.form;
        this.forcedDisabled = options.forcedDisabled;
        this.forcedError = options.forcedError;
        this.forcedHidden = options.forcedHidden;
    }

    protected abstract valueBuilder(entities: HashMap<FieldState>): any;

    protected updateParentValue(): void {
        this._forEachParent((field: EntityManager<FieldState>) => {
            this.form.store.getState((state: FormState) => {
                field.update((fieldState: FieldState) => {
                    fieldState.value = (<any>fieldState).valueBuilder(
                        state.entities
                    );
                    return fieldState;
                });
            });
        });
    }

    // TODO SPLIT FIELDS TO STATE AND MANAGER

    // private _forAllChildren(
    //     path: string,
    //     cb: (field: EntityManager<FieldState>) => void
    // ): void {
    //     this.getState((state: FormState) => {
    //         const fieldState: FieldState | undefined = state.entities[path];
    //         if (!fieldState) {
    //             return;
    //         }
    //         fieldState.children.forEach((childPath: string) => {
    //             const field:
    //                 | EntityManager<FieldState>
    //                 | undefined = this.getField(childPath);
    //             if (!field) {
    //                 return;
    //             }
    //             // field.
    //         });
    //     });
    // }

    private _forEachParent(
        cb: (field: EntityManager<FieldState>) => void
    ): void {
        const states: string[] = this.id.split('/');
        states.pop();
        while (states.length > 0) {
            const id: string = states.join('/');
            const target: EntityManager<
                FieldState
            > = this.form.store.getEntityManager(id);
            cb(target);
            states.pop();
        }
    }
}
