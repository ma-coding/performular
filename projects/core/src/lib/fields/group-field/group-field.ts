import { Observable, of } from 'rxjs';

import { Layout } from '../../layout/layout';
import { use } from '../../utils/mixin';
import { State } from '../../utils/state';
import { AbstractField } from '../abstract-field/abstract-field';
import { Abstract } from '../abstract/abstract';
import { GroupFieldOptions } from './types/group-field-options';
import { GroupFieldState } from './types/group-field-state';

export interface GroupField
    extends AbstractField<GroupFieldState>,
        Layout<GroupFieldState> {}

export class GroupField extends AbstractField<GroupFieldState> {
    protected _state$: State<GroupFieldState>;

    @use(Layout) public this?: GroupField;

    constructor(options: GroupFieldOptions) {
        super();
        options.children.forEach(
            (child: Abstract): void => child.setParent(this)
        );
        this._state$ = new State(<GroupFieldState>{
            ...this._initAbstractField(options),
            ...this._initLayout(options),
            children: options.children,
            transformer: options.transformer,
            value: this._buildValue(
                this._getRecursiveChildFields(options.children)
            )
        });
    }

    protected _getUpdateWhen(): Observable<Abstract[]> {
        return of([]); // Todo: add right actions
    }

    protected _buildValue(children: AbstractField[]): any {
        return children.reduce((prev: {}, child: AbstractField) => {
            return {
                ...prev,
                [child.id]: child.value
            };
        }, {});
    }
}
