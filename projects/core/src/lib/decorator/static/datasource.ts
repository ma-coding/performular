import { Metadata } from '../../metadata/metadata';
import { CDecorator } from '../../util/types/c-decorator';
import { InstanceDef } from '../../util/types/instance-def';
import { DataConnectionStrategy } from '../../handler/data-connection/types/data-connection-strategy';
import { DatasourceOptions } from '../types/datasource.options';

export function Datasource(
    options: DatasourceOptions
): CDecorator<InstanceDef<DataConnectionStrategy>> {
    return (target: InstanceDef<DataConnectionStrategy>): void => {
        Metadata.addItem('datasources', {
            ...options,
            target: target
        });
    };
}
