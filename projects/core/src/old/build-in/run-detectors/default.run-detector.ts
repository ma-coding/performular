import { Injectable } from '@angular/core';

import { IEffectContext } from '../../models/effects/effect';
import { IRunDetector, RunDetector } from '../../models/effects/run-detection/run-detection';

export const PERFORMULAR_RUNDETECTOR_DEFAULT: string = 'default';

@Injectable()
@RunDetector(PERFORMULAR_RUNDETECTOR_DEFAULT)
export class DefaultRunDetector implements IRunDetector {
    public strategy(context: IEffectContext): boolean {
        return true;
    }
}
