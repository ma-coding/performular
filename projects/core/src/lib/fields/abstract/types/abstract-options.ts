import { FrameworkOptions } from '../../../framework/types/framework-options';
import { IdentificationOptions } from '../../../identification/types/identification-options';
import { ItemOptions } from '../../../item/types/item-options';

export interface AbstractOptions
    extends IdentificationOptions,
        FrameworkOptions,
        ItemOptions {}
