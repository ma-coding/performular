import { Injectable } from '@angular/core';

import { IEffectContext } from '../../models/effect';
import { IRunDetector, RunDetector } from '../../models/run-detector';

export const PERFORMULAR_RUNDETECTOR_ONCHANGE: string = 'onchange';

@Injectable()
@RunDetector(PERFORMULAR_RUNDETECTOR_ONCHANGE)
export class OnChangeRunDetector implements IRunDetector {
    public strategy(context: IEffectContext): boolean {
        return context.checklist.indexOf(context.field) >= 0;
    }
}
