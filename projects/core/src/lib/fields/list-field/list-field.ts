import { Observable, of } from 'rxjs';

import { FrameworkType } from '../../framework/types/framework-type';
import { Layout } from '../../layout/layout';
import { use } from '../../utils/mixin';
import { State } from '../../utils/state';
import { AbstractField } from '../abstract-field/abstract-field';
import { AbstractFieldOptions } from '../abstract-field/types/abstract-field-options';
import { Abstract } from '../abstract/abstract';
import { ListFieldOptions } from './types/list-field-options';
import { ListFieldState } from './types/list-field-state';

export interface ListField
    extends AbstractField<ListFieldState>,
        Layout<ListFieldState> {}

export class ListField extends AbstractField<ListFieldState> {
    protected _state$: State<ListFieldState>;

    @use(Layout) public this?: ListField;

    constructor(options: ListFieldOptions) {
        super();
        const children: Abstract[] = (options.values || []).map(
            options.childGenerator
        );
        children.forEach((child: Abstract) => child.setParent(this));
        this._state$ = new State(<ListFieldState>{
            ...this._initAbstractField(<AbstractFieldOptions>{
                ...options,
                type: FrameworkType.LIST
            }),
            ...this._initLayout(options),
            childGenerator: options.childGenerator,
            children: children,
            transformer: options.transformer,
            value: this._buildValue(this._getRecursiveChildFields(children))
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
