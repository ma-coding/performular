import { Facade } from '../../facade/facade';
import { AbstractField } from '../abstract-field/abstract-field';
import { Abstract } from '../abstract/abstract';
import { GroupFieldOptions } from './types/group-field-options';

export class GroupField extends AbstractField {
    protected _facade: Facade;

    constructor(options: GroupFieldOptions) {
        super();
        options.children.forEach(
            (child: Abstract): void => child.setParent(this)
        );
        this._facade = new Facade(
            {
                ...options,
                value: this._buildValue(
                    this._getRecursiveChildFields(options.children)
                ),
                childDef: undefined
            },
            this
        );
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
