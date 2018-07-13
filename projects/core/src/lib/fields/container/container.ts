import { Observable, of } from 'rxjs';

import { Facade } from '../../facade/facade';
import { RunContext } from '../../utils/types/run-context';
import { Abstract } from '../abstract/abstract';
import { ContainerOptions } from './types/container-options';

export class Container extends Abstract {
    protected _facade: Facade;

    constructor(options: ContainerOptions) {
        super();
        options.children.forEach(
            (child: Abstract): void => child.setParent(this)
        );
        this._facade = new Facade(
            {
                ...options,
                value: undefined,
                childDef: undefined
            }
        );
    }

    protected _onTreeDown(context: RunContext): Observable<void> {
        return of();
    }

    protected _onTreeUp(): void {}
}
