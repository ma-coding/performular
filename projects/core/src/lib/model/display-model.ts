import { Observable, of } from 'rxjs';

import { RunContext } from '../util/types/run-context';
import { AbstractModel } from './abstract-model';
import { DisplayModelOptions } from './types/display-model-options';
import { DisplayModelState } from './types/display-model-state';

export abstract class DisplayModel<
    STATE extends DisplayModelState<ATTRS> = any,
    ATTRS = any
> extends AbstractModel<STATE, ATTRS> {
    get hideWhenNoChild(): DisplayModelState['hideWhenNoChild'] {
        return this._state$.select('hideWhenNoChild');
    }

    get hideWhenNoChild$(): Observable<DisplayModelState['hideWhenNoChild']> {
        return this._state$.select$('hideWhenNoChild');
    }

    protected _buildRunContext(checkedFields: any[]): any {}

    protected _initDisplayModel(
        options: DisplayModelOptions
    ): DisplayModelState {
        return {
            ...this._initAbstractModel(options),
            children: options.children || [],
            hideWhenNoChild: options.hideWhenNoChild === undefined ? true : options.hideWhenNoChild
        };
    }

    protected _onTreeDown(context: RunContext): Observable<void> {
        return of(undefined);
    }

    protected _onTreeUp(): void {
        if (!this.hideWhenNoChild) {
            return;
        }
        const everyChildHidden: boolean = this.children.every(
            (c: AbstractModel) => c.hidden
        );
        if (this.hidden !== everyChildHidden) {
            this._state$.updateKey('hidden', everyChildHidden);
        }
    }
}
