import { Component } from '@angular/core';

import { TypeBuilder } from '../../../core/src/lib/builder/type-builder';
import { Control } from '../../../core/src/lib/decorator/target/control';
import { Group } from '../../../core/src/lib/decorator/target/group';
import { List } from '../../../core/src/lib/decorator/target/list';
import { SubGroup } from '../../../core/src/lib/decorator/target/sub-group';
import { Framework } from '../../../core/src/lib/framework/framework';
import { Metadata } from '../../../core/src/lib/metadata/metadata';
import { ContainerModel } from '../../../core/src/lib/model/container-model';
import { ControlFieldModel } from '../../../core/src/lib/model/control-field-model';
import { GroupFieldModel } from '../../../core/src/lib/model/group-field-model';
import { ItemModel } from '../../../core/src/lib/model/item-model';
import { LayoutModel } from '../../../core/src/lib/model/layout-model';
import { ListFieldModel } from '../../../core/src/lib/model/list-field-model';
import { ContainerModelOptions } from '../../../core/src/lib/model/types/container-model-options';
import { ControlFieldModelOptions } from '../../../core/src/lib/model/types/control-field-model-options';
import { GroupFieldModelOptions } from '../../../core/src/lib/model/types/group-field-model-options';
import { ItemModelOptions } from '../../../core/src/lib/model/types/item-model-options';
import { LayoutModelOptions } from '../../../core/src/lib/model/types/layout-model-options';
import { ListFieldModelOptions } from '../../../core/src/lib/model/types/list-field-model-options';

Metadata.addItem('models', {
    name: 'test',
    target: class A {},
    builder: (options: GroupFieldModelOptions): GroupFieldModel =>
        new GroupFieldModel(options)
});
Metadata.addItem('models', {
    name: 'input',
    target: class A {},
    builder: (options: ControlFieldModelOptions): ControlFieldModel =>
        new ControlFieldModel(options)
});
Metadata.addItem('models', {
    name: 'fieldset',
    target: class A {},
    builder: (options: ContainerModelOptions): ContainerModel =>
        new ContainerModel(options)
});
Metadata.addItem('models', {
    name: 'list',
    target: class A {},
    builder: (options: ListFieldModelOptions): ListFieldModel =>
        new ListFieldModel(options)
});
Metadata.addItem('models', {
    name: 'item',
    target: class A {},
    builder: (options: ItemModelOptions): ItemModel => new ItemModel(options)
});
Metadata.addItem('models', {
    name: 'layout',
    target: class A {},
    builder: (options: LayoutModelOptions): LayoutModel =>
        new LayoutModel(options)
});

Framework.setItemModel('item');
Framework.setLayoutModel('layout');

@Group<keyof SubForm>({
    attrs: null,
    id: 'SUBFORM',
    model: 'test',
    layout: 'row',
    children: ['name']
})
export class SubForm {
    @Control({
        attrs: null,
        model: 'input',
        defaultValue: 5
    })
    public name?: string;
}

@Group<keyof Form>({
    attrs: null,
    id: 'FORM',
    model: 'test',
    layout: 'column',
    children: [
        {
            flex: 100,
            child: 'input'
        },
        'grp',
        'grpArr'
    ]
})
export class Form {
    @SubGroup({
        childTarget: SubForm
    })
    public grp?: SubForm;

    @List({
        attrs: undefined,
        childTarget: SubForm,
        model: 'list'
    })
    public grpArr?: SubForm[];

    @Control({
        attrs: null,
        model: 'input'
    })
    public input?: number;
}
console.log(Metadata.getFormItem(Form));

console.log(
    TypeBuilder.build(Form, {
        grp: { name: 'wolf' },
        grpArr: [{ name: 'abc' }, { name: 'def' }],
        input: 5
    })
);
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor() {
        /* const group: GroupFieldModel = Builder.build<GroupFieldModel, any>(
            {
                id: '1234',
                type: ModelType.GROUP,
                attrs: '',
                model: 'test',
                children: {
                    t5: {
                        type: ModelType.CONTROL,
                        attrs: null,
                        model: 'input',
                        defaultValue: 10
                    },
                    t9: {
                        type: ModelType.CONTAINER,
                        attrs: null,
                        model: 'fieldset',
                        children: [
                            {
                                id: 't6',
                                type: ModelType.CONTROL,
                                attrs: null,
                                model: 'input',
                                defaultValue: 10
                            }
                        ]
                    },
                    t10: {
                        type: ModelType.LIST,
                        attrs: null,
                        model: 'list',
                        childModel: {
                            id: 't11',
                            type: ModelType.CONTAINER,
                            attrs: null,
                            model: 'fieldset',
                            children: [
                                {
                                    id: 't66',
                                    type: ModelType.CONTROL,
                                    attrs: null,
                                    model: 'input',
                                    defaultValue: 10
                                }
                            ]
                        }
                    }
                }
            },
            {
                t5: 8,
                t6: 109,
                t10: [8, 20]
            }
        ); */
    }
}
