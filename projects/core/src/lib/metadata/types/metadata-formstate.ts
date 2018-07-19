import { ControlOptions } from '../../decorator/types/control-options';
import { GroupOptions } from '../../decorator/types/group-options';
import { ListOptions } from '../../decorator/types/list-options';
import { SubGroupOptions } from '../../decorator/types/sub-group-options';
import { MetadataTarget } from './metadata-target';

export interface MetadataFormstate {
    controls: MetadataTarget<ControlOptions>[];
    groups: MetadataTarget<GroupOptions>[];
    lists: MetadataTarget<ListOptions>[];
    subGroups: MetadataTarget<SubGroupOptions>[];
}
