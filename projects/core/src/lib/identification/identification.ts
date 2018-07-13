import { Observable } from 'rxjs';

import { generateUUID } from '../utils/generate-uuid';
import { State } from '../utils/state';
import { IdentificationOptions } from './types/identification-options';
import { IdentificationState } from './types/identification-state';

export abstract class Identification<T extends IdentificationState> {

    protected abstract _state$: State<T>;

    get id(): string {
        return this._state$.select('id');
    }

    get id$(): Observable<string> {
        return this._state$.select$('id');
    }

    get uuid(): string {
        return this._state$.select('uuid');
    }

    get uuid$(): Observable<string> {
        return this._state$.select$('uuid');
    }

    protected _initIdentification(
        options: IdentificationOptions
    ): IdentificationState {
        return {
            ...options,
            uuid: generateUUID()
        };
    }
}
