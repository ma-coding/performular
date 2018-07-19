import { State } from '../../util/state';
import { LayoutOptions } from './types/layout-options';
import { LayoutState } from './types/layout-state';

// Todo: add full implementation
export class Layout extends State<LayoutState> {
    constructor(options: LayoutOptions) {
        super(options);
    }
}
