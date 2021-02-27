import { Component, Input } from '@angular/core';
import { UploadEvidenceEvent } from '../upload-evidence-event';

@Component({
  selector: 'app-uploadevidence-details',
  templateUrl: './upload-evidence-details.component.html',
  styleUrls: ['./upload-evidence-details.component.css']
})
export class UploadEvidenceDetailsComponent {
  @Input() evidenceEvent: UploadEvidenceEvent;
  @Input() evidenceIndex: number;

  stake = 1.5;

  constructor() {}
}
