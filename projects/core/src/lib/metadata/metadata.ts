import { InstanceDef } from '../util/types/instance-def';
import { MetadataFormstate } from './types/metadata-formstate';
import { MetadataState } from './types/metadata-state';

// @dynamic
export class Metadata {
    private static _state: MetadataState = Metadata._initStore();
    private static _formstate: MetadataFormstate = Metadata._initFormstate();

    public static addFormItem<K extends keyof MetadataFormstate>(
        key: K,
        item: any
    ): void {
        this._formstate[key] = [...this._formstate[key], item];
    }

    public static getFormstate(): MetadataFormstate {
        return this._formstate;
    }

    public static getFormItem(target: any): MetadataFormstate {
        return {
            groups: this._formstate.groups.filter(
                (g: any) => g.target === target
            ),
            controls: this._formstate.controls.filter(
                (g: any) => g.target === target
            ),
            lists: this._formstate.lists.filter(
                (g: any) => g.target === target
            ),
            subGroups: this._formstate.subGroups.filter(
                (g: any) => g.target === target
            )
        };
    }

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
            models: {},
            datasources: {}
        };
    }

    private static _initFormstate(): MetadataFormstate {
        return {
            controls: [],
            groups: [],
            lists: [],
            subGroups: []
        };
    }
}
