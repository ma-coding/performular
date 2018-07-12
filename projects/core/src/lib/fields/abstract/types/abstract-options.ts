import { FrameworkOptions } from '../../../framework/types/framework-options';
import { IdentificationOptions } from '../../../identification/types/identification-options';

export interface AbstractOptions
    extends IdentificationOptions,
        FrameworkOptions {}
