import { Item } from '../../item/item';
import { Layout } from '../../layout/layout';

export interface PositioningState {
    layout: Layout | undefined;
    item: Item;
}
