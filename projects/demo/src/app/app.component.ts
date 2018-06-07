import { Component } from '@angular/core';

import {
    Control,
    FormTypes,
    Group,
    IInput,
    ITextarea,
    Performular,
    PERFORMULAR_FORMCOMPONENT_FIELDSET,
    PERFORMULAR_FORMCOMPONENT_INPUT,
    PERFORMULAR_FORMCOMPONENT_TEXTAREA,
} from '@performular/core';

import { CoreGroupProperty } from './group.component';
import { CoreListProperty } from './list.component';

export interface Props extends FormTypes {
    0: IInput;
    1: CoreGroupProperty<Props>;
    2: CoreListProperty<Props>;
    3: ITextarea;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public test: string = 'MENSCH';
    public count: number = 2;

    public c: Performular<Props> = new Performular<Props>({
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
                ...this.get(), {
                    id: 'list',
                    type: 'list',
                    framework: {
                        field: 'corelist',
                        attrs: undefined
                    },
                    layout: {
                        direction: {
                            main: 'column'
                        }
                    },
                    childDef: this.getListItem()
                }
            ]
        },
        value: {
            test5: 'das',
            list: [
                'abc'
            ]
        }
    });

    constructor(
    ) {
        console.log(this.c);
        (<Group>this.c.form).value$.subscribe(console.log);
    }

    public get(): IInput[] {
        const res: IInput[] = [];
        for (let i: number = 0; i < this.count; i++) {
            res.push({
                id: 'test' + i,
                type: 'control',
                framework: {
                    field: PERFORMULAR_FORMCOMPONENT_INPUT,
                    attrs: {
                        type: 'text'
                    },
                    styles: {
                        input: {
                            marginTop: '9px',
                            marginBottom: '9px',
                        }
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
                        main: 20
                    }
                },
                focus: true,
            });
        }
        return res;
    }

    public getVal(): any {
        const res: any = {};
        for (let i: number = 0; i < this.count; i++) {
            res['test' + i] = (15432 * i) % (3 * Math.pow(i, 2 * (1 + Math.random())));
        }
        return res;
    }

    public getListItem(): any {
        return {
            id: 'listitem',
            type: 'container',
            framework: {
                field: PERFORMULAR_FORMCOMPONENT_FIELDSET,
                attrs: {
                    legend: 'ITEM'
                }
            },
            layout: {
                direction: {
                    main: 'column'
                }
            },
            children: [{
                id: 'listitemcontrol',
                type: 'control',
                framework: {
                    field: PERFORMULAR_FORMCOMPONENT_TEXTAREA,
                    attrs: {
                        rows: 10
                    }
                }
            }]
        };
    }

    public reset(): void {
        (<Group>this.c.form).resetValue();
    }

    public patch(): void {
        (<Group>this.c.form).patchValue(this.getVal());
    }

    public hide(): void {
        const c: Control = (<Control>(<Group>this.c.form).getChildFields()[0]);
        c.setForcedHidden(!c.hidden);
    }

    public rem(): void {
        const c: Control = (<Control>(<Group>this.c.form).getChildFields()[0]);
        c.removeValidator('req');
    }

    public add(): void {
        const c: Control = (<Control>(<Group>this.c.form).getChildFields()[0]);
        c.addValidator({
            id: 'req',
            name: 'required',
            errorMsg: 'Fehler',
        });
    }
}
