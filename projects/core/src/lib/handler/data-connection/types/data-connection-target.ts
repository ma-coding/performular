import { InstanceDef } from '../../../util/types/instance-def';
import { DataConnectionStrategy } from './data-connection-strategy';

export type DataConnectionTarget = string | InstanceDef<DataConnectionStrategy>;
