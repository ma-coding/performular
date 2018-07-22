import { InstanceDef } from '../util/types/instance-def';
import { AbstractFieldRenderer } from './abstract-field-renderer';
import { AbstractForm } from './abstract-form';
import { AbstractInjector } from './abstract-injector';

// @dynamic
export abstract class Framework {
    private static _injector: AbstractInjector | undefined;
    private static _layoutModel: string | InstanceDef<any> | undefined;
    private static _itemModel: string | InstanceDef<any> | undefined;
    private static _form: AbstractForm | undefined;
    private static _fieldRenderer: AbstractFieldRenderer | undefined;

    public static setForm(options: AbstractForm): void {
        this._form = options;
    }

    public static getForm(): AbstractForm {
        if (this._form) {
            return this._form;
        }
        throw new Error('');
    }

    public static setFieldRenderer(options: AbstractFieldRenderer): void {
        this._fieldRenderer = options;
    }

    public static getFieldRenderer(): AbstractFieldRenderer {
        if (this._fieldRenderer) {
            return this._fieldRenderer;
        }
        throw new Error('');
    }

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
