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

}
