import { MetadataStore } from '../../factory/metadata/metadata-store';
import { CDecorator } from '../../utils/types/c-decorator';
import { InstanceDef } from '../../utils/types/instance-def';
import { RunDetectorOptions } from './types/run-detector-options';
import { RunDetectorStrategy } from './types/run-detector-strategy';

export function RunDetector(
    options: RunDetectorOptions
): CDecorator<InstanceDef<RunDetectorStrategy>> {
    return (target: InstanceDef<RunDetectorStrategy>): void => {
        MetadataStore.setItem('runDetectors', {
            ...options,
            target: target
        });
    };
}
