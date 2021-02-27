import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts.component';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from './alerts.service';

@NgModule({
  imports: [
    CommonModule, NgbAlertModule, NgbModalModule
  ],
  declarations: [ AlertsComponent ],
  providers: [ AlertsService ],
  exports: [ AlertsComponent ]
})
export class AlertsModule {
}
