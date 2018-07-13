import { FrameworkOptions } from '../../../framework/types/framework-options';
import { IdentificationOptions } from '../../../identification/types/identification-options';
import { ItemOptions } from '../../../item/types/item-options';
import { StructurOptions } from '../../../structur/types/structur-options';

export interface AbstractOptions
    extends IdentificationOptions,
    FrameworkOptions, StructurOptions, ItemOptions { }
