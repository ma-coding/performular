import { Facade } from '../../facade/facade';
import { AbstractField } from '../abstract-field/abstract-field';
import { ListFieldOptions } from './types/list-field-options';

export class ListField extends AbstractField {
    protected _facade: Facade;

    constructor(options: ListFieldOptions) {
        super();
        this._facade = new Facade(
            {
                ...options,
                children: []
            },
            this
        );
    }

    protected _buildValue(children: AbstractField[]): any {}
}
