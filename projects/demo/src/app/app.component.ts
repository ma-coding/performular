import { Component } from '@angular/core';

import { Abstract, FormTypes, Performular } from '@performular/core';

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
                    main: 'column',
                    ltSm: 'row'
                },
                gap: {
                    main: '18px'
                }
            },
            children: [
                {
                    id: 'test3',
                    type: 'control',
                    framework: {
                        field: 'input',
                        attrs: {
                            type: 'text'
                        },
                        styles: {
                            host: {
                                width: '100%'
                            },
                            input: {
                                width: '100%'
                            }
                        }
                    },
                    item: {
                        flex: {
                            main: 100,
                            ltSm: 100
                        }
                    },
                    focus: true,
                },
                {
                    id: 'test5',
                    type: 'control',
                    framework: {
                        field: 'input',
                        attrs: {
                            type: 'text'
                        },
                        styles: {
                            host: {
                                width: '100%'
                            },
                            input: {
                                width: '100%'
                            }
                        }
                    },
                    item: {
                        flex: {
                            main: 50,
                            ltSm: 100
                        }
                    },
                    focus: true,
                },
            ]
        },
        value: {
            test3: 5,
            test5: 10
        }
    }).form;

    constructor(
    ) {
        console.log(this.c);
    }
}
