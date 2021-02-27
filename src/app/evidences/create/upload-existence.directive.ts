import { Directive, NgZone } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { UploadEvidencesContractService } from '../upload-evidences-contract.service';

@Directive({
  selector: '[appUploadExistence]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useClass: UploadExistenceDirective, multi: true}]
})
export class UploadExistenceDirective implements AsyncValidator {

  constructor(private uploadEvidencesContractService: UploadEvidencesContractService,
              private ngZone: NgZone) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer) => {
        this.uploadEvidencesContractService.getEvidenceExistence(control.value)
        .subscribe((exists: boolean) => {
          this.ngZone.run(() => {
            if (exists) {
              observer.next({'uploadExistence': true});
              observer.complete();
            } else {
              observer.next(null);
              observer.complete();
            }
          });
        }, error => {
          this.ngZone.run(() => {
            observer.next(null);
            observer.complete();
          });
        });
    });
  }
}
