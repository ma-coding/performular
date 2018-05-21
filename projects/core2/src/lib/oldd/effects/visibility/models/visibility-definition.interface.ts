import { IVisibleDefinition } from './visible-definition.interface';

export interface IVisibilityDefintion {
    visibles?: IVisibleDefinition[];
    forceHidden?: boolean;
    forceDisabled?: boolean;
}
