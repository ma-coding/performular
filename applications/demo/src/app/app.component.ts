import { Component } from '@angular/core';

/**
 * Entry Component
 * @export
 */
@Component({
    selector: 'pfd-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    /**
     * member that holds the application title
     */
    public title: string = 'app';
}
