import { Validator } from '../../decorator/static/validator';
import { ValidationExecuter } from '../../handler/validation/types/validation-executer';
import { AbstractFieldModel } from '../../model/abstract-field-model';
import { isEmptyValue } from '../../util/is-empty-value';
import { RunContext } from '../../util/types/run-context';
import { OnChangeRunDetector } from '../run-detection/on-change.run-detection';

export const PERFORMULAR_VALIDATOR_REQUIRED: 'required' = 'required';

@Validator({
    name: PERFORMULAR_VALIDATOR_REQUIRED,
    runDetector: OnChangeRunDetector
})
export class RequiredValidator implements ValidationExecuter {
    constructor() {}

    public execute(context: RunContext, params?: void): any {
        if (isEmptyValue((<AbstractFieldModel>context.field).value)) {
            return {};
        }
        return undefined;
    }
}
