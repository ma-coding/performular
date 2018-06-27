import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

export class InputValueHandler {
    private _valueSubject: Subject<any> = new Subject<any>();

    public valueChanges: Observable<any>;

    constructor(public type: string, public debounce: number) {
        this.valueChanges = this._valueSubject.pipe(
            debounceTime(debounce),
            map((value: any) => {
                return InputValueHandler.validateValue(value, type);
            })
        );
    }

    public static validateValue(value: any, type: string): any {
        if (!value) {
            return null;
        }
        if (type === 'number') {
            const val: number = parseFloat(value);
            return isNaN(val) ? null : val;
        }
        return value;
    }

    public setValue(value: any): void {
        this._valueSubject.next(value);
    }

}
