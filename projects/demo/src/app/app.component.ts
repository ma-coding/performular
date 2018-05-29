import { Component } from '@angular/core';

import { FormTypes, IContainer, IControl, IGroup, Performular } from '@performular/core';

type Input = IControl<'input', { type: string }, 'input'>;
type Select = IControl<'select', { count: number }, 'input' | 'option'>;
type Group<P extends FormTypes> = IGroup<'group', undefined, any, P>;
type Fieldset<P extends FormTypes> = IContainer<'fieldset', { legend: string }, 'fieldset' | 'legend', P>;

export interface Props extends FormTypes {
    0: Input;
    1: Fieldset<Props>;
    2: Select;
    3: Group<Props>;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(
    ) {
        const performular: Performular<Props> = new Performular<Props>({
            property: {
                id: 'gg',
                type: 'group',
                framework: {
                    field: 'group',
                    attrs: undefined
                },
                children: [
                    {
                        id: 'test',
                        type: 'control',
                        framework: {
                            field: 'input',
                            attrs: {
                                type: 'number'
                            }
                        },
                        focus: true
                    },
                    {
                        id: 'test3',
                        type: 'control',
                        framework: {
                            field: 'input',
                            attrs: {
                                type: 'number'
                            }
                        },
                        focus: true
                    },
                    {
                        id: 'FF',
                        type: 'container',
                        framework: {
                            field: 'fieldset',
                            attrs: {
                                legend: ''
                            }
                        },
                        children: [
                            {
                                id: 'gg2',
                                type: 'group',
                                framework: {
                                    field: 'group',
                                    attrs: undefined
                                },
                                children: [
                                    {
                                        id: 'test',
                                        type: 'control',
                                        framework: {
                                            field: 'input',
                                            attrs: {
                                                type: 'number'
                                            }
                                        },
                                        focus: true
                                    },
                                    {
                                        id: 'test3',
                                        type: 'control',
                                        framework: {
                                            field: 'input',
                                            attrs: {
                                                type: 'number'
                                            }
                                        },
                                        focus: true
                                    }
                                ]
                            }
                        ]
                    },
                ]
            },
            value: {
                test: 6,
                test3: 89,
                gg2: {
                    test: 7,
                    test3: 99,
                }
            }
        });
        console.log(performular.form.value());
    }

}
