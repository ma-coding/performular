import { Abstract, IAbstract } from './models/abstract';
import { Container, IContainer } from './models/container';
import { Control, IControl } from './models/control';
import { Group, IGroup } from './models/group';
import { IList, List } from './models/list';

export interface IPerformularOptions {
    errorWhen: boolean;
}

export interface IPerformular<P = any> {
    options?: IPerformularOptions;
    value?: any;
    property: P;
}

export class Performular {

    private _config: IPerformular;
    private _form: Abstract;

    constructor(config: IPerformular) {
        this._config = config;
        this._form = this._build(config.property, []);
    }

    private _build(abstract: IAbstract<'container' | 'control' | 'group' | 'list', any, any>, path: string[]): Abstract {
        switch (abstract.type) {
            case 'container': {
                const container: IContainer<any, any, any> = <IContainer<any, any, any>>abstract;
                container.children = container.children.map((c: IAbstract<any, any, any>) => {
                    return this._build(c, path);
                });
                return new Container(container);
            }
            case 'control': {
                const control: IControl<any, any> = <IControl<any, any>>abstract;
                return new Control(control);
            }
            case 'group': {
                const group: IGroup<any, any, any> = <IGroup<any, any, any>>abstract;
                group.children = group.children.map((c: IAbstract<any, any, any>) => {
                    return this._build(c, path);
                });
                return new Group(group);
            }
            case 'list': {
                const list: IList<any, any, any> = <IList<any, any, any>>abstract;
                list.children = list.value.map((val: any) => {
                    return this._build(list.childStructure, path);
                })
                return new List(list);
            }
        }
    }
}
