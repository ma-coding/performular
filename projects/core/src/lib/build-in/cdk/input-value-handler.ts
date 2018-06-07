import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

export class InputValueHandler {
    private _valueSubject: Subject<any> = new Subject<any>();

    public valueChanges: Observable<any>;

    constructor(public type: string) {
        this.valueChanges = this._valueSubject.pipe(
            debounceTime(500),
            map((value: any) => {
                if (type === 'number') {
                    try {
                        return parseFloat(value);
                    } catch (err) {
                        return value;
                    }
                }
                return value;
            })
        );
    }

    public setValue(value: any): void {
        this._valueSubject.next(value);
    }

}
