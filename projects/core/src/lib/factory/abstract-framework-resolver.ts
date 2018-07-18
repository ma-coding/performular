import { Abstract } from '../fields/abstract/abstract';

export abstract class AbstractFrameworkResolver {
    public abstract createComponent(field: Abstract, refElement: any): any;
    public abstract removeComponent(field: Abstract, refElement: any): any;
}
