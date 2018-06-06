import { Component } from '@angular/core';

import { Abstract, Control, FormTypes, Group, Performular } from '@performular/core';

import { CoreGroupProperty } from './group.component';
import { InputProperty } from './input.component';

export interface Props extends FormTypes {
    0: InputProperty;
    1: CoreGroupProperty<Props>;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public c: Abstract = new Performular<Props>({
        property: {
            id: 'group',
            type: 'group',
            framework: {
                field: 'coregroup',
                attrs: undefined
            },
            layout: {
                direction: {
                    main: 'row wrap'
                },
                gap: {
                    main: '18px'
                }
            },
            children: [
                {
                    id: 'test5',
                    type: 'control',
                    framework: {
                        field: 'input',
                        attrs: {
                            type: 'text'
                        }
                    },
                    validation: {
                        validators: [
                            {
                                id: 'req',
                                name: 'required',
                                errorMsg: 'Fehler',
                            }
                        ]
                    },
                    item: {
                        flex: {
                            main: 100
                        }
                    },
                    focus: true,
                }
            ]
        },
        value: {
            test5: 'das'
        }
    }).form;

    constructor(
    ) {
        this.c.updates$.subscribe();
    }

    public reset(): void {
        (<Group>this.c).resetValue();
    }

    public patch(): void {
        (<Group>this.c).patchValue({
            test3: 'ddd',
            test5: 'eee'
        });
    }

    public hide(): void {
        const c: Control = (<Control>(<Group>this.c).getChildFields()[0]);
        c.setForcedHidden(!c.hidden);
    }
}
