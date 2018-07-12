import { Observable } from 'rxjs';

import { Facade } from '../facade/facade';
import { generateUUID } from '../utils/generate-uuid';
import { IdentificationOptions } from './types/identification-options';
import { IdentificationState } from './types/identification-state';

export abstract class Identification {
    get id(): string {
        return this._identficationFacade.select('id');
    }

    get id$(): Observable<string> {
        return this._identficationFacade.select$('id');
    }

    get uuid(): string {
        return this._identficationFacade.select('uuid');
    }

    get uuid$(): Observable<string> {
        return this._identficationFacade.select$('uuid');
    }

    protected abstract _identficationFacade: Facade;

    protected _initIdentification(
        options: IdentificationOptions
    ): IdentificationState {
        return {
            ...options,
            uuid: generateUUID()
        };
    }
}
