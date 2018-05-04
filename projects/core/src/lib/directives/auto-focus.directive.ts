import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[performularAutoFocus]'
})
export class AutoFocusDirective implements OnInit {
    private _autofocus: boolean = false;

    @Input()
    set performularAutoFocus(condition: boolean) {
        this._autofocus = condition !== false;
        this._setFocus();
    }

    constructor(private el: ElementRef) { }

    public ngOnInit(): void {
        this._setFocus();
    }

    private _setFocus(): void {
        if (this._autofocus || this._autofocus === undefined) {
            this.el.nativeElement.focus();
        }
    }
}
