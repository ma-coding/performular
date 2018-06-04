import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Control, FormComponent, IControl, IOnInitFramework } from '@performular/core';

export interface InputBindings {
    type: string;
}

export type InputStyles = 'input';

export type InputProperty = IControl<'input', InputBindings, InputStyles>;
export type Input = Control<'input', InputBindings, InputStyles>;

@FormComponent({
    name: 'input'
})
@Component({
    selector: 'app-input',
    template: `<input
    [value]="field?.value$ | async"
    (input)="onInput($event)"
     [ngStyle]="(field?.styles$ | async)?.input"
      [type]="(field.attrs$ | async).type"
       style="width: 100%">`,
    styles: [`
            :host {
                width: 100%;
            }
        `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements IOnInitFramework<Input> {

    public field: Input = <any>undefined;

    public onInitFramework(field: Input): void {
        this.field = field;
    }

    public onInput(event: any): void {
        this.field.setValue(event.target.value, true);
    }
}
