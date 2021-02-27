import { Event } from '../util/event';
import { UploadEvidence } from './uploadEvidence';

export class UploadEvidenceEvent extends Event {
  what: UploadEvidence;

  constructor(event: any) {
    super({ type: event.event, who: event.returnValues.evidencer });
    this.what = new UploadEvidence({
      evidencedHash: event.returnValues.evidencedHash,
      evidenceHash: event.returnValues.evidenceHash
    });
  }
}
