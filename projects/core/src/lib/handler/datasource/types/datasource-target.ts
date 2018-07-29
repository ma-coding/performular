import { InstanceDef } from '../../../util/types/instance-def';
import { DatasourceStrategy } from './datasource-strategy';

export type DatasourceTarget = string | InstanceDef<DatasourceStrategy>;
