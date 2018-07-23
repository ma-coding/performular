import { RunDetector } from '../../decorator/static/run-detector';
import { RunDetectionStrategy } from '../../handler/run-detection/types/run-detection-strategy';
import { RunContext } from '../../util/types/run-context';

export const PERFORMULAR_RUNDETECTOR_ONCHANGE: string = 'onchange';

@RunDetector({
    name: PERFORMULAR_RUNDETECTOR_ONCHANGE
})
export class OnChangeRunDetector implements RunDetectionStrategy {
    public strategy(context: RunContext, params: any): boolean {
        return context.checkedFields.indexOf(context.field) >= 0;
    }
}
