import { Abstract, IAbstractProperty } from '../models/abstract';
import { IContainerParams, IContainerProperty } from '../models/container';
import { IControlParams, IControlProperty } from '../models/control';
import { BuildFunction, IFormComponentDecoration } from '../models/framework/decorator';
import { IGroupParams, IGroupProperty } from '../models/group';
import { IListParams, IListProperty } from '../models/list';
import { Store } from './store';

export interface IFormOptions {
    updateDebounce?: number;
}

export type ParamType = IControlParams | IGroupParams | IContainerParams | IListParams;

export interface IFormConfig {
    form: ParamType;
    value?: any;
    options?: IFormOptions;
}

export class Performular {

    public static build(config: IFormConfig): Abstract {
        return this._build(config.form, config.value, config.options);
    }

    private static _build(form: any, value: any, options?: IFormOptions): Abstract {
        const property: IAbstractProperty = this._buildProperty(form, value, options);
        const metadata: IFormComponentDecoration<any> = Store.getFormComponent(property.field).metadata;
        const builder: BuildFunction<any> = metadata.builder;
        return builder({ params: property });
    }

    private static _buildProperty(
        form: any, value: any, options?: IFormOptions
    ): IAbstractProperty {
        switch (form.type) {
            case 'group':
            case 'container': {
                return <IContainerProperty | IGroupProperty>{
                    ...<any>form,
                    options: options,
                    children: form.children.map((c: IAbstractProperty) => {
                        if (c.type === 'container') {
                            return this._build(c, value, options);
                        }
                        return this._build(c, value && value[c.id] ? value[c.id] : value, options);
                    })
                };
            }
            case 'list': {
                return <IListProperty>{
                    ...<any>form,
                    childDef: form.childDef,
                    options: options,
                    children: (value || []).map((val: any) => {
                        return this._build(form.childDef, val, options);
                    })
                };
            }
            case 'control': {
                return <IControlProperty>{
                    ...<any>form,
                    options: options,
                    focus: !!form.focus,
                    value: value
                };
            }
            default: {
                throw Error(`Unknown Form Type ${form.type} use container list group or control!`);
            }
        }
    }
}
