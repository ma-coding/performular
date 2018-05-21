import { MetadataStore } from '../../helpers/metadata-store';
import { IEffectOptions } from '../models/effect-options.interface';

export function Validator(name: string, options: IEffectOptions): ClassDecorator {
    return (target: Function): void => {
        MetadataStore.addValidator(name, options, <any>target);
    };
}
