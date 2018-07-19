import { Metadata } from '../../metadata/metadata';
import { CDecorator } from '../../util/types/c-decorator';
import { ModelOptions } from '../types/model.options';

export function Model(options: ModelOptions): CDecorator<any> {
    return (target: any): void => {
        Metadata.addItem('models', {
            ...options,
            target: target
        });
    };
}
