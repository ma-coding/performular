import {
    Reactor,
    Action,
    AbstractModel,
    AbstractFieldModel
} from '@performular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Reactor({
    name: 'DEMO_ALERT'
})
export class DemoReactor implements Action {
    public action(field: AbstractModel, params: string): Observable<void> {
        const model: AbstractFieldModel = field as AbstractFieldModel;
        return model.value$.pipe(
            map((value: any) => {
                if (model.parentField) {
                    const smodel:
                        | AbstractFieldModel
                        | undefined = model.parentField.find(params);
                    if (smodel) {
                        smodel.setValue(value, true);
                    }
                }
            })
        );
    }
}
