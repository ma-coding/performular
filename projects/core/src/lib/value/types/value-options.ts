import { TransformerOptions } from '../../transformer/types/transformer-options';

export interface ValueOptions {
    value: any;
    defaultValue?: any;
    transformer?: TransformerOptions;
}
