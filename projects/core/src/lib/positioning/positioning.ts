import { Facade } from '../facade/facade';
import { Item } from '../item/item';
import { Layout } from '../layout/layout';
import { PositioningOptions } from './types/positioning-options';
import { PositioningState } from './types/positioning-state';

export abstract class Positioning {
    protected abstract _positioningFacade: Facade;

    protected _initPositioning(options: PositioningOptions): PositioningState {
        return {
            item: new Item(options.item),
            layout: options.layout ? new Layout(options.layout) : undefined
        };
    }
}
