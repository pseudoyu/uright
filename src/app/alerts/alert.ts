export class Alert {

  private readonly _type: AlertType;
  private readonly ALERT_CLASS: string[] = ['danger', 'info', 'success', 'warning'];
  message: string;
  timerId: number;

  constructor(type: AlertType, message: string) {
    this._type = type;
    this.message = message;
  }

  get type(): string {
    return this.ALERT_CLASS[this._type];
  }
}

export enum AlertType { danger, info, success, warning }
