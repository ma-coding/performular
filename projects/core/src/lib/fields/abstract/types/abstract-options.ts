import { FrameworkOptions } from '../../../framework/types/framework-options';
import { IdentificationOptions } from '../../../identification/types/identification-options';
import { StructurOptions } from '../../../structur/types/structur-options';

export interface AbstractOptions
    extends IdentificationOptions,
    FrameworkOptions, StructurOptions { }
