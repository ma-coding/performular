export interface UpdateResult<ENTITY> {
    count: number;
    ids: string[];
    entities: ENTITY[];
}
