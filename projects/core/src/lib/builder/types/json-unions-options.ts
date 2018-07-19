import { JsonContainerOptions } from './json-container-options';
import { JsonControlOptions } from './json-control-options';
import { JsonGroupOptions } from './json-group-options';
import { JsonListOptions } from './json-list-options';

export type JsonUnionOptions =
    | JsonControlOptions
    | JsonGroupOptions
    | JsonListOptions
    | JsonContainerOptions;
