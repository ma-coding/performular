import { Observable, Subject } from 'rxjs';
import { HashMap } from '../../utils/types';
import { MemoryDriver } from './memory.driver';

export interface MemoryEntityState {
    entities: HashMap<any>;
    ids: string[];
}

export type MemoryState = HashMap<MemoryEntityState>;

export class MemoryAction<T = any> {
    public result: Subject<T> = new Subject();
    constructor(
        public readonly type: string,
        public driver: MemoryDriver,
        public reducer: (
            state: MemoryState
        ) => MemoryState | Observable<MemoryState>
    ) {}
}
