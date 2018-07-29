import { AbstractDecoratorOptions } from './abstract-decorator.options';

export interface AbstractEffectOptions extends AbstractDecoratorOptions {
    runDetector?: any; // Todo: add Type
}
