import { VisibleHandler } from '../visible.handler';
import { IVisibleInternalResult } from './visible-internal-result.interface';

export interface IVisibilityState {
    visibles: VisibleHandler[];
    disabled: boolean;
    hidden: boolean;
    forceHidden: boolean;
    forceDisabled: boolean;
    visibleResults: { [name: string]: IVisibleInternalResult | undefined };
}
