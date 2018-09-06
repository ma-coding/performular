import { Driver } from './driver';
import { Newable } from '../utils/types';
import { EntityManager } from './entity-manager';
import { EntityMetadata } from '../metadata/entity';
import { MetadataStorage } from '../metadata/metadata-storage';
import { QueryRunner } from './query-runner';

export class Store {
    constructor(public driver: Driver) {}

    public connect(): Promise<void> {
        return this.driver.connect();
    }

    public disconnect(): Promise<void> {
        return this.driver.disconnect();
    }

    public createQueryRunner(): QueryRunner {
        const queryRunner: QueryRunner = this.driver.createQueryRunner();
        queryRunner.manager = this.createEntityManager(queryRunner);
        queryRunner.store = this;
        return queryRunner;
    }

    public createEntityManager(queryRunner?: QueryRunner): EntityManager {
        return new EntityManager(this, queryRunner);
    }

    public getMetadata<ENTITY>(
        entity: Newable<ENTITY>
    ): EntityMetadata<ENTITY> {
        const metadata:
            | EntityMetadata<ENTITY>
            | undefined = MetadataStorage.instance.getEntity<ENTITY>(entity);
        if (!metadata) {
            throw new Error('Unknown Metadata');
        }
        return metadata;
    }
}
