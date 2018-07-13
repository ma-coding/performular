import { FrameworkState } from '../../../framework/types/framework-state';
import { IdentificationState } from '../../../identification/types/identification-state';
import { StructurState } from '../../../structur/types/structur-state';

export interface AbstractState extends IdentificationState, FrameworkState, StructurState { }
