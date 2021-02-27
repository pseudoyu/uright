export class Manifestation {
  hash: string;
  title: string;
  authors: string[];
  when: Date;
  expiry: Date;

  constructor(values: Object = {}) {
    if (values.hasOwnProperty('when')) {
      values['when'] = new Date(values['when'] * 1000);
    }
    if (values.hasOwnProperty('expiry')) {
      values['expiry'] = new Date(values['expiry'] * 1000);
    }
    Object.assign(this, values);
  }
}
