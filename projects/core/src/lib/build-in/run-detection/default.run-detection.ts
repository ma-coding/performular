import { RunDetector } from '../../decorator/static/run-detector';
import { RunDetectionStrategy } from '../../handler/run-detection/types/run-detection-strategy';
import { RunContext } from '../../util/types/run-context';

export const PERFORMULAR_RUNDETECTOR_DEFAULT: string = 'default';

@RunDetector({
    name: PERFORMULAR_RUNDETECTOR_DEFAULT
})
export class DefaultRunDetector implements RunDetectionStrategy {
    public strategy(context: RunContext, params: any): boolean {
        return true;
    }
}
