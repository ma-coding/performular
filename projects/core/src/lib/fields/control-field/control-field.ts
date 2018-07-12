import { Facade } from '../../facade/facade';
import { AbstractField } from '../abstract-field/abstract-field';
import { ControlFieldOptions } from './types/control-field-options';

export class ControlField extends AbstractField {
    protected _facade: Facade;

    constructor(options: ControlFieldOptions) {
        super();
        this._facade = new Facade(
            {
                ...options,
                children: [],
                childDef: undefined
            },
            this
        );
    }

    protected _buildValue(children: AbstractField[]): any {}
}
