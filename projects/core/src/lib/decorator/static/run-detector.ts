import { RunDetectionStrategy } from '../../handler/run-detection/types/run-detection-strategy';
import { Metadata } from '../../metadata/metadata';
import { CDecorator } from '../../util/types/c-decorator';
import { InstanceDef } from '../../util/types/instance-def';
import { RunDetectorOptions } from '../types/run-detector.options';

// Todo set right CDecorator type
export function RunDetector(
    options: RunDetectorOptions
): CDecorator<InstanceDef<RunDetectionStrategy>> {
    return (target: any): void => {
        Metadata.addItem('runDetectors', {
            ...options,
            target: target
        });
    };
}
