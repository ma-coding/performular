import { SWITCHER } from '../../../internal/utils/types';

export interface VisibleOptions<M extends boolean = true> {
    params: any;
    mode: 'HIDE' | 'DISABLE';
    isVisibile?: SWITCHER<M, boolean, never>;
}

export interface Visibiles<M extends boolean = true> {
    [target: string]: VisibleOptions<M>;
}
export interface Visibilities<M extends boolean = true> {
    visibles?: Visibiles<M>;
    forcedDisabled?: boolean;
    forcedHidden?: boolean;
}

export type VisibilitiesOptions = Visibilities<false>;

export type VisibilitiesState = Visibilities<true>;
