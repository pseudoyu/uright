import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { YouTubeEvidenceEvent } from './youtube-evidence-event';

@Component({
  selector: 'app-youtubeevidence-modal-content',
  template: `
    <div *ngIf="data.what.isVerified" class="modal-header bg-success text-white">
      <h4 class="modal-title">Success<br/><small>Registered new YouTube Evidence</small></h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div *ngIf="!data.what.isVerified" class="modal-header bg-danger text-white">
      <h4 class="modal-title">Failed<br/><small>YouTube Evidence not Linked to Manifestation</small></h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="card mb-4">
        <div class="card-block row m-1">
          <h5 class="card-title col-md-12 p-1">YouTube Evidence</h5>
          <div class="col-md-12 p-1 mb-1">
            <h6 class="card-subtitle text-muted">YouTube Video</h6>
            <a class="card-text" href="https://www.youtube-nocookie.com/embed/{{data.what.videoId}}" target="_blank">
              {{data.what.videoId}}</a>
          </div>
          <div class="col-md-12 p-1 mb-1">
            <h6 class="card-subtitle text-muted">For Manifestation</h6>
            <a class="card-text" [routerLink]="['/manifestations', data.what.evidencedId]">
              {{data.what.evidencedId}}</a>
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
export class YouTubeEvidenceEventComponent {
  @Input() data: YouTubeEvidenceEvent;

  constructor(public activeModal: NgbActiveModal,
              private router: Router) {}

  details(): void {
    this.activeModal.dismiss();
    this.router.navigate(['/manifestations', this.data.what.evidencedId]);
  }
}
