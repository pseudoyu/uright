import { Component, Input } from '@angular/core';
import { YouTubeEvidenceEvent } from '../youtube-evidence-event';

@Component({
  selector: 'app-youtubeevidence-details',
  templateUrl: './youtube-evidence-details.component.html',
  styleUrls: ['./youtube-evidence-details.component.css']
})
export class YouTubeEvidenceDetailsComponent {
  @Input() evidenceEvent: YouTubeEvidenceEvent;
  @Input() evidenceIndex: number;

  stake = 2.5;

  constructor() {}
}
