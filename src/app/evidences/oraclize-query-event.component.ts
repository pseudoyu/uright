import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OraclizeQueryEvent } from './oraclize-query-event';

@Component({
  selector: 'app-oraclizequery-modal-content',
  template: `
    <div class="modal-header bg-warning text-white">
      <h4 class="modal-title">Pending<br/><small>YouTube Evidence Query Submitted</small></h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="card mb-4">
        <div class="card-block row m-1">
          <h5 class="card-title col-md-12 p-1">Oraclize Query</h5>
          <div class="col-md-12 p-1 mb-1">
            <h6 class="card-subtitle text-muted">Query Identifier</h6>
            <a class="card-text">
              {{data.what}}</a>
          </div>
          <div class="col-md-6 p-1 mb-1">
            <h6 class="card-subtitle text-muted">When</h6>
            <p class="card-text">{{data.when | date:'medium'}}</p>
          </div>
          <div class="col-md-6 p-1 mb-1">
            <h6 class="card-subtitle text-muted">Note</h6>
            <p *ngIf="data.watching" class="card-text">The query to verify this evidence has
            been submitted. As soon as there is a response you will be informed.</p>
            <p *ngIf="!data.watching" class="card-text">Sorry, your connection does not allow
            event monitoring so we will not be able to inform you about the outcome of the
            evidence verification. Please, reload this page in a minute or so to see if it is
            valid and has been added.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" ngbAutofocus class="btn btn-info" (click)="activeModal.dismiss()">Close</button>
    </div>
  `,
  styles: ['.modal-body { font-size: smaller; }']
})
export class OraclizeQueryEventComponent {
  @Input() data: OraclizeQueryEvent;

  constructor(public activeModal: NgbActiveModal) {}
}
