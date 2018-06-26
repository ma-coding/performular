import { Directive, Input } from '@angular/core';
import { Abstract } from '../models/abstract';

@Directive({
    selector: '[performularRenderer]'
})
export class RendererDirective {

    @Input() set performularRenderer(f: Abstract | undefined) {
        if (!f) {
            return;
        }
        this._createField(f);
    }
}
