import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UploadEvidenceEvent } from './upload-evidence-event';

@Component({
  selector: 'app-uploadevidence-modal-content',
  template: `
    <div class="modal-header bg-success text-white">
      <h4 class="modal-title">Success<br/><small>Registered new Uploadable Evidence</small></h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="card mb-4">
        <div class="card-block row m-1">
          <h5 class="card-title col-md-12 p-1">Uploadable Evidence</h5>
          <div class="col-md-12 p-1 mb-1">
            <h6 class="card-subtitle text-muted">Uploaded Content</h6>
            <a class="card-text" href="https://ipfs.infura.io/ipfs/{{data.what.evidenceHash}}" target="_blank">
              {{data.what.evidenceHash}}</a>
          </div>
          <div class="col-md-12 p-1 mb-1">
            <h6 class="card-subtitle text-muted">For Manifestation</h6>
            <a class="card-text" [routerLink]="['/manifestations', data.what.evidencedHash]">
              {{data.what.evidencedHash}}</a>
          </div>
          <div class="col-md-6 p-1 mb-1">
            <h6 class="card-subtitle text-muted">By</h6>
            <p class="card-text" title="{{data.who}}">
              {{data.who | slice:0:6}}...{{data.who | slice:-4}}
            </p>
          </div>
          <div class="col-md-6 p-1 mb-1">
            <h6 class="card-subtitle text-muted">When</h6>
            <p class="card-text">{{data.when | date:'medium'}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" ngbAutofocus class="btn btn-info" (click)="details()">Manifestation Details</button>
    </div>
  `,
  styles: ['.modal-body { font-size: smaller; }']
})
export class UploadEvidenceEventComponent {
  @Input() data: UploadEvidenceEvent;

  constructor(public activeModal: NgbActiveModal,
              private router: Router) {}

  details(): void {
    this.activeModal.dismiss();
    this.router.navigate(['/manifestations', this.data.what.evidencedHash]);
  }
}
