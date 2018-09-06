import { QueryRunner } from './query-runner';

export interface Driver {
    connect(): Promise<void>;
    disconnect(): Promise<void>;

    createQueryRunner(): QueryRunner;

    generatesPrimaryKeys(): boolean;
}
