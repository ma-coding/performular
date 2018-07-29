import { DataConnectionTarget } from './data-connection-target';

export interface DataConnectionOptions {
    target: DataConnectionTarget;
    params?: any;
    resetInvisibleValue?: boolean;
}
