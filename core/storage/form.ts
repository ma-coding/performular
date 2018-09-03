import { EntityStore } from '../internal/store/entity-store/entity-store';
import { EntityState } from '../internal/store/entity-store/entity-state';
import { GroupFieldOptions, GroupField } from './states/group-field';
import { FieldState, buildEntities } from './states/all';
import { EntityManager } from '../internal/store/entity-store/entity-manager';
import { AbstractField } from './states/abstract-field';

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
