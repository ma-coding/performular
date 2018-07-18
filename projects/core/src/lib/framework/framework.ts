import { isComponent } from '../component/is-component';
import { ComponentTarget } from '../component/types/component-target';
import { ComponentOptions } from '../component/types/component.options';
import { MetadataStore } from '../factory/metadata/metadata-store';
import { MergeTarget } from '../factory/metadata/types/merge-target';
import { isString } from '../utils/is-string';
import { State } from '../utils/state';
import { InstanceDef } from '../utils/types/instance-def';
import { FrameworkOptions } from './types/framework-options';
import { FrameworkState } from './types/framework-state';
import { FrameworkType } from './types/framework-type';

// Todo: add full implementation
export abstract class Framework<T extends FrameworkState> {
    protected abstract _state$: State<T>;

    get type(): FrameworkType {
        return this._state$.select('type');
    }

    get isField(): boolean {
        return this.type !== FrameworkType.CONTAINER;
    }

    protected _initFramework(options: FrameworkOptions): FrameworkState {
        return {
            ...options,
            field: this._loadComponent(options.field),
            instance: undefined
        };
    }

    private _loadComponent(field: ComponentTarget): InstanceDef<any> {
        if (isString(field)) {
            const metadata: MergeTarget<
                ComponentOptions,
                InstanceDef<any>
            > = MetadataStore.getItem('components', field);
            if (metadata) {
                return MetadataStore.getItem('components', field).target;
            } else {
                throw new Error('');
            }
        } else if (isComponent(field)) {
            return field;
        } else {
            throw new Error('');
        }
    }
}
