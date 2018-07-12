import { LayoutOptions } from '../../layout/types/layout-options';
import { PositioningItemOptions } from './positioning-item-options';

export interface PositioningOptions extends PositioningItemOptions {
    layout?: LayoutOptions;
}
