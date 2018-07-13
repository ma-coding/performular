import { Container } from './fields/container/container';
import { ControlField } from './fields/control-field/control-field';
import { GroupField } from './fields/group-field/group-field';
import { FrameworkType } from './framework/types/framework-type';

const k: GroupField = new GroupField({
    id: 'test',
    attrs: undefined,
    field: '',
    type: FrameworkType.GROUP,
    children: [
        new Container({
            id: 'cont',
            attrs: undefined,
            children: [
                new ControlField({
                    id: 'cc',
                    attrs: undefined,
                    field: '2',
                    type: FrameworkType.CONTROL,
                    value: '2',
                    defaultValue: 5
                })
            ],
            field: '',
            type: FrameworkType.CONTAINER
        })
    ]
});
console.log(k.value);
