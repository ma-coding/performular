import { Abstract, IAbstract } from './models/abstract';
import { Container, IContainer, IContainerParams } from './models/container';
import { Control, IControl, IControlParams } from './models/control';
import { Group, IGroup, IGroupParams } from './models/group';
import { IList, IListParams, List } from './models/list';

export type FormTypes = Array<IAbstract<any, any, any>>;
// tslint:disable-next-line
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type S<T> = Exclude<NonFunctionPropertyNames<T>, 'length'>;
export type Property<T extends FormTypes> = T[S<T>];

export interface IPerformularOptions {
    errorWhen: boolean;
}

export interface IPerformular<P extends FormTypes> {
    options?: IPerformularOptions;
    value?: any;
    property: Property<P>;
}

export class Performular<P extends FormTypes> {

    private _config: IPerformular<P>;
    private _form: Abstract;

    get form(): any {
        return this._form;
    }

    constructor(config: IPerformular<P>) {
        this._config = config;
        this._form = this._build(config.property, []);
    }

    private _build(abstract: Property<P>, path: Array<string | number>): Abstract {
        switch (abstract.type) {
            case 'container': {
                const container: IContainer = <any>abstract;
                const containerParams: IContainerParams = {
                    ...container,
                    children: container.children.map((c: any) => {
                        if (c.type === 'container') {
                            return this._build(c, path);
                        }
                        return this._build(c, this._addToPath(path, c.id));
                    })
                };
                return new Container(containerParams);
            }
            case 'control': {
                const control: IControl = <any>abstract;
                const controlParams: IControlParams = {
                    ...control,
                    value: this._getValueFromPath(path)
                };
                return new Control(controlParams);
            }
            case 'group': {
                const group: IGroup = <any>abstract;
                const groupParams: IGroupParams<any, any> = {
                    ...group,
                    children: group.children.map((c: any) => {
                        if (c.type === 'container') {
                            return this._build(c, path);
                        } else {
                            return this._build(c, this._addToPath(path, c.id));
                        }
                    })
                };
                return new Group(groupParams);
            }
            case 'list': {
                const list: IList = <any>abstract;
                const value: any = this._getValueFromPath(path, this._config.value);
                const listParams: IListParams = {
                    ...list,
                    children: (value && Array.isArray(value)) ? value.map((c: any, index: number) => {
                        return this._build(c, this._addToPath(path, index));
                    }) : []
                };
                return new List(listParams);
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
            return value;
        }
        const first: string | number | undefined = path.shift();
        if (value && first && value[first] !== undefined) {
            return this._getValueFromPath(path, value[first]);
        } else {
            return null;
        }
    }
}
