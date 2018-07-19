import { CDecorator } from '../../util/types/c-decorator';
import { GroupOptions } from '../types/group-options';

export function Group(options: GroupOptions): CDecorator<any> {
    return (target: any): void => {};
}
