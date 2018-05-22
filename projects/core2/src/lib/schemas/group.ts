import { State } from '../misc';
import { MapType } from '../models/misc';
import { IGroupSchema } from '../models/schema';
import { IGroupState } from '../models/state';
import { AbstractSchema } from './abstract';
import { FieldSchema } from './field';

export class GroupSchema<F, A, S extends string> extends FieldSchema<'group', F, A, S> {

    private _group$: State<IGroupState>;

    constructor(group: IGroupSchema<F, A, S, any>) {
        super(group);
        this._group$ = new State<IGroupState>({
            children: {}// group.children  TODO BUILD REAL FIELDS
        });
    }

    protected _forEachChild(cb: (child: AbstractSchema) => void): void {
        const children: MapType<AbstractSchema> = this._group$.getValue().children;
        Object.keys(children)
            .forEach((key: string) => cb(children[key]));
    }
}
