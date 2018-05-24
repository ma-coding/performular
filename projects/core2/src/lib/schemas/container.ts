import { State } from '../misc';
import { Constructable } from '../models/misc';
import { IContainerSchema } from '../models/schema';
import { IContainerState } from '../models/state';
import { Abstractable, IAbstractable } from './abstract';
import { ILayoutable, Layoutable } from './layout';

export interface IContainerable<F = any, A = any, S extends string = any>
    extends IAbstractable<'container', F, A, S>, ILayoutable { }

export function Containerable<F, A, S extends string, P = any>():
    Constructable<IContainerable<F, A, S>, IContainerSchema<F, A, S, P>> {
    class Container extends Layoutable<IContainerable<F, A, S>>(Abstractable<'container', F, A, S>()) {
        private _container$: State<IContainerState>;

        constructor(abstract: IContainerSchema<F, A, S, P>) {
            super(abstract);
            const children: IAbstractable[] = []; // TODO: Build Children
            children.forEach((child: IAbstractable) => {
                child.setParent(this);
            });
            this._container$ = new State<IContainerState>({
                children: []
            });
        }

        public forEachChild(cb: (child: IAbstractable) => void): void {
            this._container$.getValue().children.forEach(cb);
        }

    }
    return Container as any;
}

export class Fieldset extends Containerable<'fieldset', { t: number }, 'legend'>() { }
