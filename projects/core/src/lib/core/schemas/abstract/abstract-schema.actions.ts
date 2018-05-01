import { ElementRef } from '@angular/core';

import { ReducedAction } from '../../redux/actions';
import { AbstractSchema } from './abstract-schema';
import { IAbstractSchemaState } from './abstract-schema.state';

export namespace AbstractSchemaActions {

    export class SetHiddenAction extends ReducedAction<IAbstractSchemaState<any>> {

        constructor(public hidden: boolean) { super(); }

        public reduce(state: IAbstractSchemaState<any>): IAbstractSchemaState<any> {
            return {
                ...state,
                hidden: this.hidden
            };
        }

    }

    export class SetInstanceAction extends ReducedAction<IAbstractSchemaState<any>> {

        constructor(public instance: any | undefined, public elementRef: ElementRef | undefined) { super(); }

        public reduce(state: IAbstractSchemaState<any>): IAbstractSchemaState<any> {
            return {
                ...state,
                instance: this.instance,
                elementRef: this.elementRef
            };
        }

    }

    export class SetBindingsAction<BindingsType> extends ReducedAction<IAbstractSchemaState<any>> {

        constructor(public bindings: BindingsType) { super(); }

        public reduce(state: IAbstractSchemaState<BindingsType>): IAbstractSchemaState<BindingsType> {
            return {
                ...state,
                bindings: this.bindings
            };
        }

    }

    export class ClearChildElementsAction extends ReducedAction<IAbstractSchemaState<any>> {

        constructor() { super(); }

        public reduce(state: IAbstractSchemaState<any>): IAbstractSchemaState<any> {
            return {
                ...state,
                children: []
            };
        }

    }

    export class PushChildElementAction extends ReducedAction<IAbstractSchemaState<any>> {

        constructor(public child: AbstractSchema<any>) { super(); }

        public reduce(state: IAbstractSchemaState<any>): IAbstractSchemaState<any> {
            return {
                ...state,
                children: [
                    ...state.children,
                    this.child
                ]
            };
        }

    }

    export class PopChildElementAction extends ReducedAction<IAbstractSchemaState<any>> {

        constructor() { super(); }

        public reduce(state: IAbstractSchemaState<any>): IAbstractSchemaState<any> {
            state.children.pop();
            return {
                ...state,
                children: [
                    ...state.children
                ]
            };
        }

    }

    export class RemoveChildElementAtIndexAction extends ReducedAction<IAbstractSchemaState<any>> {

        constructor(public index: number) { super(); }

        public reduce(state: IAbstractSchemaState<any>): IAbstractSchemaState<any> {
            state.children.splice(this.index, 1);
            return {
                ...state,
                children: [
                    ...state.children
                ]
            };
        }

    }

    export class SetParentElementAction extends ReducedAction<IAbstractSchemaState<any>> {

        constructor(public parent: AbstractSchema<any>) { super(); }

        public reduce(state: IAbstractSchemaState<any>): IAbstractSchemaState<any> {
            return {
                ...state,
                parent: this.parent
            };
        }

    }
}
