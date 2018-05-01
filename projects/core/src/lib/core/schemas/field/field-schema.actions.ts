import { cloneDeep, isEqual } from 'lodash';

import { Action, ReducedAction } from '../../redux/actions';
import { IFieldSchemaState } from './field-schema.state';

export namespace FieldSchemaActions {

    export class SetHiddenResultsAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public hiddenResults: boolean[]) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                hiddenResults: this.hiddenResults.map((res: boolean, index: number) => {
                    if (res === null) {
                        const lastResult: boolean = state.hiddenResults[index];
                        if (lastResult === true || lastResult === false) {
                            return lastResult;
                        }
                    }
                    return res;
                })
            };
        }

    }

    export class SetDisabledResultsAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public disabledResults: boolean[]) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                disabledResults: this.disabledResults.map((res: boolean, index: number) => {
                    if (res === null) {
                        const lastResult: boolean = state.disabledResults[index];
                        if (lastResult === true || lastResult === false) {
                            return lastResult;
                        }
                    }
                    return res;
                })
            };
        }

    }

    export class SetErrorResultsAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public errorResults: string[]) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                errorResults: this.errorResults.map((res: string, index: number) => {
                    if (res === null) {
                        const lastResult: string = state.errorResults[index];
                        if (lastResult) {
                            return lastResult;
                        }
                    }
                    return res;
                })
            };
        }

    }

    export class SetDisabledAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public disabled: boolean) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                disabled: this.disabled
            };
        }

    }

    export class SetInvalidAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public invalid: boolean) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                invalid: this.invalid
            };
        }

    }

    export class SetErrorStateAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public errorState: boolean) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                errorState: this.errorState
            };
        }

    }

    export class SetForceDisabledAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public forceDisabled: boolean) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                forceDisabled: this.forceDisabled
            };
        }

    }

    export class SetForceHiddenAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public forceHidden: boolean) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                forceHidden: this.forceHidden
            };
        }

    }

    export class SetValueAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public value: any) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                value: this.value,
                changed: !isEqual(this.value, state.initialValue),
                dirty: true
            };
        }

    }

    export class PatchValueAction extends ReducedAction<IFieldSchemaState<any>> {

        constructor(public value: any) { super(); }

        public reduce(state: IFieldSchemaState<any>): IFieldSchemaState<any> {
            return {
                ...state,
                value: this.value,
                initialValue: cloneDeep(this.value),
                changed: false,
                dirty: true
            };
        }

    }

    export class UpdateValueAction extends Action {
        constructor(public checklist: string[]) { super(); }
    }

}
