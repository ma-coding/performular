import { HashMap } from '../../utils/types';
import { Entity } from './entity';

export interface EntityState<T extends Entity = Entity> {
    entities: HashMap<T>;
}
