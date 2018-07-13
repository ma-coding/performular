import { Abstract } from '../fields/abstract/abstract';
import { State } from '../utils/state';
import { FrameworkOptions } from './types/framework-options';
import { FrameworkState } from './types/framework-state';
import { FrameworkType } from './types/framework-type';

export abstract class Framework<T extends FrameworkState> {
    protected abstract _state$: State<T>;
    protected abstract _field: Abstract;

    get type(): FrameworkType {
        return this._state$.select('type');
    }

    get isField(): boolean {
        return this.type !== FrameworkType.CONTAINER;
    }

    protected _initFramework(options: FrameworkOptions): FrameworkState {
        return {
            ...options,
            instance: undefined
        };
    }
}
