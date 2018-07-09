import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[performularAutoFocus]'
})
export class AutoFocusDirective {
    private _autofocus: boolean = false;

    @Input() set performularAutoFocus(f: boolean) {
        this._autofocus = f;
        if (this._autofocus) {
            this.el.nativeElement.focus();
        }
    }

    constructor(private el: ElementRef) { }
}
