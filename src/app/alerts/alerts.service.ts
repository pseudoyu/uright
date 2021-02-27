import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Alert, AlertType } from './alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class AlertsService {

  private alertsSource = new Subject<Alert>();
  public alerts$ = this.alertsSource.asObservable();

  constructor(private modalService: NgbModal) { }

  error(message: string) {
    this.alertsSource.next(new Alert(AlertType.danger, message));
  }

  info(message: string) {
    this.alertsSource.next(new Alert(AlertType.info, message));
  }

  success(message: string) {
    this.alertsSource.next(new Alert(AlertType.success, message));
  }

  warning(message: string) {
    this.alertsSource.next(new Alert(AlertType.warning, message));
  }

  modal(content: any, data: any) {
    const modalRef = this.modalService.open(content);
    modalRef.componentInstance.data = data;
  }
}
