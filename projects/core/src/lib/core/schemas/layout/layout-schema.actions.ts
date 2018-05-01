import { ReducedAction } from '../../redux/actions';
import { ILayoutSchemaState } from './layout-schema.state';

export namespace LayoutSchemaActions {

    export class SetAutoHideAction extends ReducedAction<ILayoutSchemaState<any>> {

        constructor(public autoHide: boolean) { super(); }

        public reduce(states: ILayoutSchemaState<any>): ILayoutSchemaState<any> {
            return {
                ...states,
                autoHide: this.autoHide
            };
        }

    }

}
