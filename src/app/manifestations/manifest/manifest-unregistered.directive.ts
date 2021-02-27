import { Directive, NgZone } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ManifestationsContractService } from '../manifestations-contract.service';
import { Manifestation } from '../manifestation';

@Directive({
  selector: '[appManifestUnregistered]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useClass: ManifestUnregisteredDirective, multi: true}]
})
export class ManifestUnregisteredDirective implements AsyncValidator {

  constructor(private manifestationsContractService: ManifestationsContractService,
              private ngZone: NgZone) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        this.manifestationsContractService.getManifestation(control.value)
        .subscribe((manifestation: Manifestation) => {
          if (!manifestation.title) {
            this.ngZone.run(() => {
              observer.next(null);
              observer.complete();
            });
          } else {
            this.manifestationsContractService.getEvidenceCount(control.value)
            .subscribe(evidenceCount => {
              this.ngZone.run(() => {
                if (evidenceCount > 0 || manifestation.expiry >= new Date()) {
                  observer.next({'manifestUnregistered': {title: manifestation.title}});
                  observer.complete();
                } else {
                  observer.next(null);
                  observer.complete();
                }
              });
            });
          }
        }, error => {
          this.ngZone.run(() => {
            observer.next(null);
            observer.complete();
          });
        });
      });
    });
  }
}
