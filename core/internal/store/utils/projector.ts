import { isFunction } from '../../utils/is';
import { StateFn } from '../types/state-fn';

export function getProjector<S>(
    project?: StateFn<S, any> | string
): StateFn<S, any> {
    if (!project) {
        return (state: S): S => state;
    }
    if (isFunction(project)) {
        return project;
    }
    if (typeof project === 'string') {
        return (state: S): any => state[project];
    }
    throw new Error('Unknown Project Value');
}
