import { Metadata } from '../../metadata/metadata';
import { CDecorator } from '../../util/types/c-decorator';
import { ModelOptions } from '../types/model.options';
import { InstanceDef } from '../../util/types/instance-def';

export function Model(options: ModelOptions): CDecorator<InstanceDef<any>> {
    return (target: any): void => {
        Metadata.addItem('models', {
            ...options,
            target: target
        });
    };
}
