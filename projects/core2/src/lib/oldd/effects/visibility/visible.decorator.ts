import { MetadataStore } from '../../helpers/metadata-store';
import { IEffectOptions } from '../models/effect-options.interface';

export function Visible(name: string, options: IEffectOptions): ClassDecorator {
    return (target: Function): void => {
        MetadataStore.addVisible(name, options, <any>target);
    };
}
