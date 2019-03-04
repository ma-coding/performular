import { AbstractModel } from '../../model/abstract-model';
import { AbstractDecoratorOptions } from './abstract-decorator.options';

export interface ModelOptions extends AbstractDecoratorOptions {
    emptyValue?(): any;
    builder(options: any): AbstractModel;
}
