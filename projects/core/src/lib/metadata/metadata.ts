import { InstanceDef } from '../util/types/instance-def';
import { MetadataState } from './types/metadata-state';

// @dynamic
export class Metadata {
    private static _state: MetadataState = Metadata._initStore();

    public static addItem<
        K extends keyof MetadataState,
        I extends keyof MetadataState[K]
    >(key: K, value: MetadataState[K][I]): void {
        this._state[key] = Object.assign({}, this._state[key], {
            [value.name]: value
        });
    }

    public static getItem<
        K extends keyof MetadataState,
        I extends keyof MetadataState[K]
    >(key: K, name: I): MetadataState[K][I] {
        return this._state[key][name];
    }

    public static findTarget<
        K extends keyof MetadataState,
        I extends keyof MetadataState[K]
    >(key: K, target: InstanceDef<any>): MetadataState[K][I] {
        const objKey: string | undefined = Object.keys(this._state[key]).find(
            (k: string) => this._state[key][k].target === target
        );
        if (objKey) {
            return this._state[key][objKey];
        } else {
            throw new Error('Todo:');
        }
    }

    private static _initStore(): MetadataState {
        return {
            runDetectors: {},
            validators: {},
            visibles: {},
            models: {}
        };
    }
}
