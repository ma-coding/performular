import { BehaviorSubject } from 'rxjs';

import { Effects } from '../effects/effects';
import { Abstract } from '../fields/abstract/abstract';
import { Framework } from '../framework/framework';
import { Identification } from '../identification/identification';
import { Positioning } from '../positioning/positioning';
import { Structur } from '../structur/structur';
import { use } from '../utils/mixin';
import { State } from '../utils/state';
import { Value } from '../value/value';
import { FacadeOptions } from './types/facade-options';
import { FacadeState } from './types/facade-state';

export interface Facade
    extends Identification,
        Effects,
        Value,
        Structur,
        Framework,
        Positioning {}

export class Facade extends State<FacadeState> {
    protected _state$: BehaviorSubject<FacadeState>;

    @use(Identification, Effects, Value, Structur, Framework, Positioning)
    public this?: Facade;

    constructor(options: FacadeOptions, public abstractField: Abstract) {
        super();
        this._state$ = new BehaviorSubject({
            ...this._initIdentification(options),
            ...this._initStructur(options),
            ...this._initEffects(options),
            ...this._initFramework(options),
            ...this._initPositioning(options),
            ...this._initValue(options)
        });
        this._identficationFacade = this;
        this._effectsFacade = this;
        this._valueFacade = this;
        this._structurFacade = this;
        this._frameworkFacade = this;
        this._positioningFacade = this;
    }
}
