import { Observable } from 'rxjs';

export interface DataOption {
    viewValue: string;
    value: any;
    disabled$: Observable<boolean>;
    hidden$: Observable<boolean>;
}
