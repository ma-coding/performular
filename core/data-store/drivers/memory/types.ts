import { HashMap } from '../../utils/types';

export interface MemoryEntityState {
    entities: HashMap<any>;
    ids: string[];
}

export type MemoryState = HashMap<MemoryEntityState>;
