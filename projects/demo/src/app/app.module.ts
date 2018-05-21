import { Injectable, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { Observable, of } from 'rxjs';

import { PerformulerCoreModule } from '@performular/core';

import { IEffectContext } from '../../../core2/src/lib/effects/models/effect-context.interface';
import { RunDetection } from '../../../core2/src/lib/effects/models/run-detection.enum';
import { IValidatorResult } from '../../../core2/src/lib/effects/validation/models/validator-result.interface';
import { IValidator } from '../../../core2/src/lib/effects/validation/models/validator.interface';
import { Validator } from '../../../core2/src/lib/effects/validation/validator.decorator';
import { AppComponent } from './app.component';

@Validator('test', {
    runDetection: RunDetection.AnyChanged
})
@Injectable()
export class Test implements IValidator {
    public onValidate(context: IEffectContext, params: any): Observable<IValidatorResult> {
        return of({
            error: true,
            msgParams: {
                A: 5
            }
        });
    }
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        FormsModule,
        FlexLayoutModule,
        BrowserModule,
        PerformulerCoreModule.withConfig({
            validators: [Test]
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
