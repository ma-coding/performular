import { Abstract } from '../fields/abstract/abstract';
import { State } from '../utils/state';
import { ItemOptions } from './types/item-options';
import { ItemState } from './types/item-state';

export abstract class Item<T extends ItemState> {
    protected abstract _state$: State<T>;
    protected abstract _field: Abstract;

    protected _initItem(options: ItemOptions): ItemState {
        return {
            ...options
        };
    }
}
