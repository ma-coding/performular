import { State } from '../utils/state';
import { LayoutOptions } from './types/layout-options';
import { LayoutState } from './types/layout-state';

export abstract class Layout<T extends LayoutState> {
    protected abstract _state$: State<T>;

    protected _initLayout(options: LayoutOptions): LayoutState {
        return {
            ...options
        };
    }
}
