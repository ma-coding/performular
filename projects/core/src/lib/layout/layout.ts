import { Abstract } from '../fields/abstract/abstract';
import { State } from '../utils/state';
import { LayoutOptions } from './types/layout-options';
import { LayoutState } from './types/layout-state';

export abstract class Layout<T extends LayoutState> {

    protected abstract _state$: State<T>;
    protected abstract _field: Abstract;

    protected _initLayout(options: LayoutOptions): LayoutState {
        return {
            ...options
        };
    }
}
