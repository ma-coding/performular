import { InstanceDef } from '../util/types/instance-def';
import { AbstractInjector } from './abstract-injector';

// @dynamic
export abstract class Framework {
    private static _injector: AbstractInjector | undefined;
    private static _layoutModel: string | InstanceDef<any> | undefined;
    private static _itemModel: string | InstanceDef<any> | undefined;

    public static setLayoutModel(options: string | InstanceDef<any>): void {
        this._layoutModel = options;
    }

    public static getLayoutModel(): string | InstanceDef<any> {
        if (this._layoutModel) {
            return this._layoutModel;
        }
        throw new Error('');
    }

    public static setItemModel(options: string | InstanceDef<any>): void {
        this._itemModel = options;
    }

    public static getItemModel(): string | InstanceDef<any> {
        if (this._itemModel) {
            return this._itemModel;
        }
        throw new Error('');
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
