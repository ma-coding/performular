import { TransformerOptions } from './types/transformer-options';

export const DefaultTransformerOptions: TransformerOptions = {
    target: {
        to: (value: any): any => value,
        from: (value: any): any => value
    }
};
