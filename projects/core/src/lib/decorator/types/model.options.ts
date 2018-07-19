import { AbstractModel } from '../../model/abstract-model';
import { AbstractModelOptions } from '../../model/types/abstract-model-options';
import { AbstractDecoratorOptions } from './abstract-decorator.options';

export interface ModelOptions extends AbstractDecoratorOptions {
    builder(options: AbstractModelOptions): AbstractModel;
}
