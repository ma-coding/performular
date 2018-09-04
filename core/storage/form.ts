import { EntityState } from '../internal/store/entity-store/entities-state';
import { EntityStore } from '../internal/store/entity-store/entity-store';
import { FieldState } from './states/all';
import { GroupField, GroupFieldOptions } from './states/group-field';

export type FormState = EntityState<FieldState>;

export class FormStore extends EntityStore<FormState, FieldState> {
    public removeField(id: string): void {
        this.transaction(() => {
            // remove all children from dict
            this.getState((state: FormState) => {
                state.entities[id].children.forEach(
                    this.removeField.bind(this)
                );
            });

            // remove the field from the Entitydict
            this.remove([id]);

            // remove child id in parent
            const states: string[] = id.split('/');
            states.pop();
            if (states.length > 0) {
                const parentId: string = states.join('/');
                this.update(
                    (state: FieldState) => {
                        return {
                            ...state,
                            children: state.children.filter(
                                (child: string) => child !== id
                            )
                        };
                    },
                    [parentId]
                );
            }
        });
    }
}

export class Form {
    private _store: FormStore;

    get store(): FormStore {
        return this._store;
    }

    constructor(options: GroupFieldOptions, value: any) {
        this._store = new FormStore({ entities: {} });
        // tslint:disable-next-line:no-unused-expression
        new GroupField(options, {
            form: this,
            name: options.name,
            path: '',
            value: value
        });
    }
}
