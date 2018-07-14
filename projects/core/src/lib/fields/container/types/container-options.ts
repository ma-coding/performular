import { LayoutOptions } from '../../../layout/types/layout-options';
import { StructurOptions } from '../../../structur/types/structur-options';
import { RemoveKey } from '../../../utils/types/remove-key';
import { AbstractOptions } from '../../abstract/types/abstract-options';

export interface ContainerOptions
    extends RemoveKey<AbstractOptions, 'type'>,
        LayoutOptions,
        StructurOptions {}
