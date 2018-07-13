import { LayoutOptions } from '../../../layout/types/layout-options';
import { StructurOptions } from '../../../structur/types/structur-options';
import { AbstractOptions } from '../../abstract/types/abstract-options';

export interface ContainerOptions
    extends AbstractOptions,
        LayoutOptions,
        StructurOptions {}
