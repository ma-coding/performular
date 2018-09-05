import { SWITCHER } from '../../../memory-store/utils/types';

export interface ValidatorOptions<M extends boolean = true> {
    params: any;
    errorMsg: string;
    hasError?: SWITCHER<M, boolean, never>;
}

export interface Validators<M extends boolean = true> {
    [target: string]: ValidatorOptions<M>;
}
export interface Validations<M extends boolean = true> {
    validators?: Validators<M>;
    forcedError?: string;
}

export type ValidationsOptions = Validations<false>;

export type ValidationsState = Validations<true>;
