import { AbstractSchema, IAbstractSchema, IAbstractState } from './abstract.schema';

export interface IAbstractFieldSchema<BType = any> extends IAbstractSchema<BType> {
    id: string;
    effects?: any[];
}

export interface IAbstractFieldState<BType = any> extends IAbstractState<BType> {
    id: string;
    effects: any[];
    effectResults: any[];
    initValue: any;
    value: any;
    disabled: boolean;
    invalid: boolean;
    errorState: boolean;
    changed: boolean;
    dirty: boolean;
}

export abstract class AbstractFieldSchema<State extends IAbstractFieldState = any, BType = any> extends AbstractSchema<State, BType> {

    constructor(schema: IAbstractFieldSchema) {
        super(schema);
        this._initState = <any>{
            ...<IAbstractState>this._initState,
            id: schema.id,
            effects: [],
            effectResults: [],
            value: undefined,
            invalid: false,
            errorState: false,
            changed: false,
            dirty: false
        };
    }

    public getParentField(): AbstractFieldSchema | undefined {
        let schema: AbstractSchema<any> = this;
        let ret: AbstractFieldSchema = this;
        while (schema.get('parent')) {
            if (schema.get('parent') instanceof AbstractFieldSchema) {
                ret = schema.get('parent');
                break;
            }
            schema = schema.get('parent');
        }
        return ret !== this ? ret : undefined;
    }

    public getChildFields(fields: AbstractSchema[] = this.get('children')): AbstractFieldSchema[] {
        const erg: AbstractFieldSchema<any>[] = [];
        fields.forEach((field: AbstractSchema<any>) => {
            if (field instanceof AbstractFieldSchema) {
                erg.push(field);
            } else {
                erg.push(...this.getChildFields(field.get('children')));
            }
        });
        return erg;
    }
}
