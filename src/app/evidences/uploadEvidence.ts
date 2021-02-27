export class UploadEvidence {
  evidencedHash: string;
  evidenceHash: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
