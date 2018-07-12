import { Facade } from '../facade/facade';
import { FrameworkOptions } from './types/framework-options';
import { FrameworkState } from './types/framework-state';
import { FrameworkType } from './types/framework-type';

export abstract class Framework {
    protected abstract _frameworkFacade: Facade;

    get type(): FrameworkType {
        return this._frameworkFacade.select('type');
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
