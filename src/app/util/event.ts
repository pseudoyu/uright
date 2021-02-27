export class Event {
  type: string;
  who: string;
  what: any;
  when: Date;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
