import { VisibleMode } from './visible-mode.enum';

export interface IVisibleDefinition {
    visible: string;
    mode: VisibleMode;
    params: any;
}
