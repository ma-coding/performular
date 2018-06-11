import { Metadata } from './metadata';
import { Abstract, IAbstract } from './models/abstract';
import { IContainer, IContainerParams } from './models/container';
import { IControl, IControlParams } from './models/control';
import { IGroup, IGroupParams } from './models/group';
import { IList, IListParams } from './models/list';

export type FormTypes = Array<IAbstract>;
// tslint:disable-next-line
export type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type Property<T extends FormTypes> = T[Exclude<NonFunctionPropertyNames<T>, 'length'>];
export type RemoveKey<T, S> = { [K in Exclude<keyof T, S>]: T[K] };

export interface IFormOptions {
    updateDebounce?: number;
}

export interface IPerformular<P extends FormTypes> {
    form: Property<P>;
    options?: IFormOptions;
    value?: any;
}

export class Performular<P extends FormTypes> {

    private _config: IPerformular<P>;
    private _form: Abstract;

    get form(): any {
        return this._form;
    }

    constructor(config: IPerformular<P>) {
        this._config = config;
        this._form = this._build(config.form, []);
    }

    private _build(abstract: Property<P>, path: Array<string | number>): Abstract {
        switch (abstract.type) {
            case 'container': {
                const container: IContainer = <any>abstract;
                const containerParams: IContainerParams = {
                    ...container,
                    options: this._config.options,
                    children: container.children.map((c: any) => {
                        if (c.type === 'container') {
                            return this._build(c, path);
                        }
                        return this._build(c, this._addToPath(path, c.id));
                    })
                };
                console.log(abstract.id, path);
                return Metadata.getFormComponent(containerParams.framework.field).metadata.builder({
                    params: containerParams
                });
            }
            case 'control': {
                const control: IControl = <any>abstract;
                const controlParams: IControlParams = {
                    ...control,
                    options: this._config.options,
                    focus: control.focus || false,
                    value: this._getValueFromPath(path)
                };
                console.log(abstract.id, path);
                return Metadata.getFormComponent(controlParams.framework.field).metadata.builder({
                    params: controlParams
                });
            }
            case 'group': {
                const group: IGroup = <any>abstract;
                const groupParams: IGroupParams<any, any> = {
                    ...group,
                    options: this._config.options,
                    children: group.children.map((child: any) => {
                        if (child.type === 'container') {
                            return this._build(child, path);
                        } else {
                            return this._build(child, this._addToPath(path, child.id));
                        }
                    })
                };
                console.log(abstract.id, path);
                return Metadata.getFormComponent(groupParams.framework.field).metadata.builder({
                    params: groupParams
                });
            }
            case 'list': {
                const list: IList = <any>abstract;
                const value: any = this._getValueFromPath(path, this._config.value);
                const listParams: IListParams = {
                    ...list,
                    options: this._config.options,
                    children: (value && Array.isArray(value)) ? value.map((c: any, index: number) => {
                        console.log(list.childDef, path, index);
                        return this._build(list.childDef, this._addToPath(path, index));
                    }) : []
                };
                console.log(abstract.id, path);
                return Metadata.getFormComponent(listParams.framework.field).metadata.builder({
                    params: listParams
                });
            }
            default: {
                throw new Error('Unknown Type');
            }
        }
    }

    private _addToPath(path: Array<string | number>, id: string | number): Array<string | number> {
        return [...path, id];
    }

    private _getValueFromPath(path: Array<string | number>, value: any = this._config.value): any {
        if (path.length === 0) {
            return value || null;
        }
        const first: string | number | undefined = path.shift();
        if (value && first && value[first] !== undefined) {
            return this._getValueFromPath(path, value[first]);
        } else {
            return null;
        }
    }
}
