import { State } from '../utils/state';
import { ItemOptions } from './types/item-options';
import { ItemState } from './types/item-state';

// Todo: add full implementation
export abstract class Item<T extends ItemState> {
    protected abstract _state$: State<T>;

    protected _initItem(options: ItemOptions): ItemState {
        return {
            ...options
        };
    }
}
