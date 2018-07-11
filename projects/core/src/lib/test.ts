import { Builder } from './builder/builder';
import { Control } from './decorators/control-decorator';
import { Group } from './decorators/group-decorator';
import { List } from './decorators/list-decorator';
import { GroupField } from './group-field/group-field';

@Group({
    id: 'item'
})
export class Item {

    @Control({})
    public l1?: number;
}

@Group({
    id: 'TestForm'
})
export class TestForm {

    @Control({})
    public test?: string;

    @Control({})
    public test2?: number;

    @List({
        childForm: Item
    })
    public items?: Item[];

}

const k: GroupField = Builder.fromType(TestForm, {
    test: '', test2: 3, items: [
        {
            l1: 123
        },
        {
            l1: 12345
        },
    ]
});
console.log(k.value);
