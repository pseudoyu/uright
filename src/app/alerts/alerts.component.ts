import { Component, NgZone, OnInit } from '@angular/core';
import { AlertsService } from './alerts.service';
import { Alert } from './alert';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  private ALERT_TIMEOUT = 7000;
  alerts: Alert[] = [];

  constructor(private alertsService: AlertsService,
              private ngZone: NgZone) { }

  ngOnInit() {
    this.alertsService.alerts$.subscribe(
      alert => {
        this.ngZone.runOutsideAngular(() => {
          alert.timerId = window.setTimeout(() => {
            this.ngZone.run(() => {
              this.close(alert);
            });
          }, this.ALERT_TIMEOUT);
        });
        this.ngZone.run(() => {
          this.alerts.push(alert);
        });
      });
  }

  close(alert: Alert) {
    clearTimeout(alert.timerId);
    this.alerts = this.alerts.filter(x => x !== alert);
  }
}
