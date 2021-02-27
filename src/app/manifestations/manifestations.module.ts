import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { ManifestationsContractService } from './manifestations-contract.service';
import { ManifestSingleComponent } from './manifest/manifest-single.component';
import { ManifestationsSearchComponent } from './search/manifestations-search.component';
import { ManifestationsListComponent } from './list/manifestations-list.component';
import { ManifestationsListAllComponent } from './list/manifestations-list-all.component';
import { ManifestUnregisteredDirective } from './manifest/manifest-unregistered.directive';
import { ManifestationDetailsComponent } from './details/manifestation-details.component';
import { ManifestEventComponent } from './manifest-event.component';
import { EvidencesModule } from '../evidences/evidences.module';

@NgModule({
  declarations: [
    ManifestSingleComponent,
    ManifestUnregisteredDirective,
    ManifestationsSearchComponent,
    ManifestationsListComponent,
    ManifestationsListAllComponent,
    ManifestationDetailsComponent,
    ManifestEventComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UtilModule,
    AlertsModule,
    EvidencesModule
  ],
  exports: [
    ManifestSingleComponent,
    ManifestationsSearchComponent,
    ManifestationsListComponent
  ],
  providers: [
    ManifestationsContractService
  ],
  bootstrap: [ ManifestEventComponent ]
})
export class ManifestationsModule { }
