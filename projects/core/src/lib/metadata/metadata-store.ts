import { AbstractInjector } from '../injector/abstract-injector';
import { MetadataArgs } from './types/metadata-args';

export class MetadataStore {
    private static _injector: AbstractInjector | undefined;
    private static _store: MetadataArgs = MetadataStore._initStore();

    public static setInjector(injector: AbstractInjector): void {
        MetadataStore._injector = injector;
    }

    public static getInjector(): AbstractInjector {
        if (MetadataStore._injector) {
            return MetadataStore._injector;
        }
        throw new Error('');
    }

    public static setItem<
        K extends keyof MetadataArgs,
        I extends keyof MetadataArgs[K]
    >(key: K, value: MetadataArgs[K][I]): void {
        // Todo: Refactor this as any
        this._store[key] = Object.assign(this._store[key], {
            [value.name as any]: value
        });
    }

    public static getItem<
        K extends keyof MetadataArgs,
        I extends keyof MetadataArgs[K]
    >(key: K, name: I): MetadataArgs[K][I] {
        return this._store[key][name];
    }

    private static _initStore(): MetadataArgs {
        return {
            runDetectors: {},
            validators: {},
            visibles: {}
        };
    }
}
