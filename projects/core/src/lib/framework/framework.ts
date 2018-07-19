import { InstanceDef } from '../util/types/instance-def';
import { AbstractInjector } from './abstract-injector';

// @dynamic
export abstract class Framework {
    private static _injector: AbstractInjector | undefined;
    private static _layoutModel: string | InstanceDef<any>;
    private static _itemModel: string | InstanceDef<any>;

    public static setLayoutModel(options: string | InstanceDef<any>): void {
        this._layoutModel = options;
    }

    public static getLayoutModel(): string | InstanceDef<any> {
        return this._layoutModel;
    }

    public static setItemModel(options: string | InstanceDef<any>): void {
        this._itemModel = options;
    }

    public static getItemModel(): string | InstanceDef<any> {
        return this._itemModel;
    }

    public static setInjector(injector: AbstractInjector): void {
        this._injector = injector;
    }

    public static getInjector(): AbstractInjector {
        if (this._injector) {
            return this._injector;
        }
        throw new Error('');
    }
}
