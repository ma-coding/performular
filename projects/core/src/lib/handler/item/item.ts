import { State } from '../../util/state';
import { ItemOptions } from './types/item-options';
import { ItemState } from './types/item-state';

// Todo: add full implementation
export class Item extends State<ItemState> {
    constructor(options: ItemOptions) {
        super(options);
    }
}
