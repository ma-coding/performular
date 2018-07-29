import { Injectable } from '@angular/core';
import { TemplateDirective, TemplatePosition } from './template.directive';

@Injectable()
export class TemplateService {
    public templates: TemplateDirective[] = [];

    public getTemplate(
        id: string,
        field: string,
        position: TemplatePosition
    ): TemplateDirective | undefined {
        return (
            (this.templates || []).find(
                (t: TemplateDirective) => t.id === id && t.position === position
            ) ||
            (this.templates || []).find(
                (t: TemplateDirective) =>
                    t.field === field && t.position === position
            )
        );
    }
}
