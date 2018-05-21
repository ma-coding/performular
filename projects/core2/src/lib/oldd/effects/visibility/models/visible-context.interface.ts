import { IEffectContext } from '../../models/effect-context.interface';

export interface IVisibleContext extends IEffectContext {
    parentDisabled: boolean;
    parentHidden: boolean;
}
