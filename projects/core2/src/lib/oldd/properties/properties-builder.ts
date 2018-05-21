import { AbstractSchema } from '../schemas/abstract.schema';
import { ArraySchema } from '../schemas/array.schema';
import { ControlSchema } from '../schemas/control.schema';
import { GroupSchema } from '../schemas/group.schema';
import { LayoutSchema } from '../schemas/layout.schema';
import { IPropertyOptions } from './models/property-options.interface';
import { PropertyType } from './models/types';

export class PropertiesBuilder {

    public static build(property: any, options: IPropertyOptions, value: any): AbstractSchema {
        switch (property.type) {
            case PropertyType.control: {
                return new ControlSchema(property, options, value);
            }
            case PropertyType.group: {
                return new GroupSchema(property, options, value);
            }
            case PropertyType.array: {
                return new ArraySchema(property, options, value);
            }
            case PropertyType.layout: {
                return new LayoutSchema(property, options, value);
            }
            default: {
                throw new Error(`Unknown PropertyType ${property.type}`);
            }
        }
    }

}
