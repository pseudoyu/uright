import { Event } from '../util/event';
import { Manifestation } from './manifestation';

export class ManifestEvent extends Event {
  what: Manifestation;

  constructor(event: any) {
    super({ type: event.event, who: event.returnValues.manifester });
    this.what = new Manifestation({
      hash: event.returnValues.hash,
      title: event.returnValues.title
    });
  }
}
