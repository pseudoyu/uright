export class YouTubeEvidence {
  evidenceId: string;
  evidencedId: string;
  videoId: string;
  isVerified: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
