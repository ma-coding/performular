import { Metadata } from '../../metadata/metadata';
import { CDecorator } from '../../util/types/c-decorator';
import { InstanceDef } from '../../util/types/instance-def';
import { Action } from '../../handler/effect/types/action';
import { ReactorOptions } from '../types/reactor-options';

export function Reactor(
    options: ReactorOptions
): CDecorator<InstanceDef<Action>> {
    return (target: InstanceDef<Action>): void => {
        Metadata.addItem('actions', {
            ...options,
            target: target
        });
    };
}
