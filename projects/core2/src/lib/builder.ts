import { Abstract, IAbstract } from './models/abstract';
import { Container, IContainer } from './models/container';
import { Control, IControl } from './models/control';
import { Group, IGroup } from './models/group';
import { IList, List } from './models/list';
import { IOptions } from './models/options';

export function builder(
    abstract: IAbstract<'container' | 'control' | 'group' | 'list', any, any>, options?: IOptions, value?: any
): Abstract {
    switch (abstract.type) {
        case 'container': {
            return new Container(<IContainer<any, any, any>>abstract, options, value);
        }
        case 'control': {
            return new Control(<IControl<any, any>>abstract, options, value);
        }
        case 'group': {
            return new Group(<IGroup<any, any, any>>abstract, options, value);
        }
        case 'list': {
            return new List(<IList<any, any, any>>abstract, options, value);
        }
    }
}
