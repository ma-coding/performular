import { ControlField } from '../control-field/control-field';
import { ControlFieldOptions } from '../control-field/types/control-field-options';
import { GroupField } from '../group-field/group-field';
import { ListField } from '../list-field/list-field';
import { InstanceDef } from '../utils/types/instance-def';

export class Builder {

    public static fromType<T>(target: InstanceDef<T>, value: T): GroupField {

        const groupOpt: any = Reflect.getMetadata('GROUP', target);
        const controlls: any = Reflect.getMetadata('CONTROLS', target);
        const lists: any = Reflect.getMetadata('LISTS', target);

        return new GroupField({
            ...groupOpt,
            children: [
                ...(controlls || []).map((c: ControlFieldOptions) => new ControlField({
                    ...c,
                    value: value[c.id]
                })),
                ...(lists || []).map((c: any) => {
                    return new ListField({
                        id: c.id,
                        values: value[c.id] || [],
                        childGenerator: (val: any): GroupField => {
                            return Builder.fromType(c.childForm, val);
                        }
                    });
                })
            ]
        });
    }
}
