import { ElementRef } from '@angular/core';

import { cloneDeep, isEqual } from 'lodash';

import { ReducedAction } from './helpers';
import { ITriggerResult } from './loaders';
import { AbstractSchema, FieldSchema, IAbstractState, IFieldState, ILayoutState, TriggerAction } from './schemas';


export namespace AbstractActions {

    export class SetHiddenAction extends ReducedAction<IAbstractState> {

        constructor(public hidden: boolean) { super(); }

        public reduce(state: IAbstractState): IAbstractState {
            return {
                ...state,
                hidden: this.hidden
            };
        }

    }

    export class SetInstanceAction extends ReducedAction<IAbstractState> {

        constructor(public instance: any | undefined, public elementRef: ElementRef | undefined) { super(); }

        public reduce(state: IAbstractState): IAbstractState {
            return {
                ...state,
                instance: this.instance,
                elementRef: this.elementRef
            };
        }

    }

    export class SetBindingsAction<BindingsType> extends ReducedAction<IAbstractState> {

        constructor(public bindings: BindingsType) { super(); }

        public reduce(state: IAbstractState): IAbstractState {
            return {
                ...state,
                bindings: this.bindings
            };
        }

    }

    export class ClearChildrenAction extends ReducedAction<IAbstractState> {

        constructor() { super(); }

        public reduce(state: IAbstractState): IAbstractState {
            return {
                ...state,
                children: []
            };
        }

    }

    export class PushChildAction extends ReducedAction<IAbstractState> {

        constructor(public child: AbstractSchema) { super(); }

        public reduce(state: IAbstractState): IAbstractState {
            return {
                ...state,
                children: [
                    ...state.children,
                    this.child
                ]
            };
        }

    }

    export class PopChildAction extends ReducedAction<IAbstractState> {

        constructor() { super(); }

        public reduce(state: IAbstractState): IAbstractState {
            state.children.pop();
            return {
                ...state,
                children: [
                    ...state.children
                ]
            };
        }

    }

    export class RemoveChildAtIndexAction extends ReducedAction<IAbstractState> {

        constructor(public index: number) { super(); }

        public reduce(state: IAbstractState): IAbstractState {
            state.children.splice(this.index, 1);
            return {
                ...state,
                children: [
                    ...state.children
                ]
            };
        }

    }

    export class SetParentAction extends ReducedAction<IAbstractState> {

        constructor(public parent: AbstractSchema) { super(); }

        public reduce(state: IAbstractState): IAbstractState {
            return {
                ...state,
                parent: this.parent
            };
        }

    }
}

export namespace FieldActions {

    export class SetDisabledAction extends ReducedAction<IFieldState> {

        constructor(public disabled: boolean) { super(); }

        public reduce(state: IFieldState): IFieldState {
            return {
                ...state,
                disabled: this.disabled
            };
        }

    }

    export class SetInvalidAction extends ReducedAction<IFieldState> {

        constructor(public invalid: boolean) { super(); }

        public reduce(state: IFieldState): IFieldState {
            return {
                ...state,
                invalid: this.invalid
            };
        }

    }

    export class SetErrorStateAction extends ReducedAction<IFieldState> {

        constructor(public errorState: boolean) { super(); }

        public reduce(state: IFieldState): IFieldState {
            return {
                ...state,
                errorState: this.errorState
            };
        }

    }

    export class SetEffectResultsAction extends ReducedAction<IFieldState> {

        constructor(public results: ITriggerResult[], public parentField?: FieldSchema) { super(); }

        public reduce(state: IFieldState): IFieldState {
            const results: ITriggerResult[] = this.results.map((res: ITriggerResult, index: number) => {
                if (res.result === undefined) {
                    const lastResult: ITriggerResult | undefined = state.effectResults[index];
                    return lastResult && lastResult.result !== undefined ? lastResult : { trigger: res.trigger, result: undefined };
                }
                return res;
            });
            return {
                ...state,
                effectResults: results,
                invalid: !!results
                    .filter(this._filterByAction(TriggerAction.Error))
                    .find(this._findTriggerFlag),
                disabled: !!results
                    .filter(this._filterByAction(TriggerAction.Disable))
                    .find(this._findTriggerFlag) || (this.parentField ? this.parentField.disabled : false),
                hidden: !!results
                    .filter(this._filterByAction(TriggerAction.Hide))
                    .find(this._findTriggerFlag) || (this.parentField ? this.parentField.hidden : false)
            };
        }

        private _filterByAction(action: TriggerAction): (res: ITriggerResult) => boolean {
            return (res: ITriggerResult): boolean => res.trigger.action === action;
        }

        private _findTriggerFlag(res: ITriggerResult): boolean {
            return res.result === true;
        }
    }

    export class SetValueAction extends ReducedAction<IFieldState> {

        constructor(public value: any) { super(); }

        public reduce(state: IFieldState): IFieldState {
            return {
                ...state,
                value: this.value,
                changed: !isEqual(this.value, state.initValue),
                dirty: true
            };
        }

    }

    export class PatchValueAction extends ReducedAction<IFieldState> {

        constructor(public value: any) { super(); }

        public reduce(state: IFieldState): IFieldState {
            return {
                ...state,
                value: this.value,
                initValue: cloneDeep(this.value),
                changed: false,
                dirty: true
            };
        }

    }

}

export namespace LayoutActions {

    export class SetAutoHideAction extends ReducedAction<ILayoutState> {

        constructor(public autoHide: boolean) { super(); }

        public reduce(state: ILayoutState): ILayoutState {
            return {
                ...state,
                autoHide: this.autoHide
            };
        }

    }

}
