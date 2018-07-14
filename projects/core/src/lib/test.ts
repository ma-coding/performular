import { Container } from './fields/container/container';
import { ControlField } from './fields/control-field/control-field';
import { GroupField } from './fields/group-field/group-field';
import { FrameworkType } from './framework/types/framework-type';
import { JsonSchema } from './json/json-schema';

const k: GroupField = new GroupField({
    id: 'test',
    attrs: undefined,
    field: '',
    children: [
        new Container({
            id: 'cont',
            attrs: undefined,
            children: [
                new ControlField({
                    id: 'cc',
                    attrs: undefined,
                    field: '2',
                    value: '2',
                    defaultValue: 5
                })
            ],
            field: ''
        })
    ]
});
console.log(k.value);

const h: GroupField = JsonSchema.create({
    schema: {
        type: FrameworkType.GROUP,
        id: 'test',
        attrs: undefined,
        field: '',
        children: [
            {
                type: FrameworkType.CONTAINER,
                id: 'cont',
                attrs: undefined,
                field: '',
                children: [
                    {
                        type: FrameworkType.CONTROL,
                        id: 'cc',
                        attrs: undefined,
                        field: '2',
                        defaultValue: '4'
                    }
                ]
            }
        ]
    },
    value: {
        cc: '2'
    }
});

console.log(h.value);
