import { Event } from '../util/event';

export class OraclizeQueryEvent extends Event {
  watching: boolean;

  constructor(event: any) {
    super({ type: event.event });
    this.what = event.returnValues.evidenceId;
    this.watching = event.watching;
  }
}
