import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { UploadEvidencesContractService } from './upload-evidences-contract.service';
import { UploadEvidenceEventComponent } from './upload-evidence-event.component';
import { UploadEvidenceComponent } from './create/upload-evidence.component';
import { UploadEvidenceDetailsComponent } from './details/upload-evidence-details.component';
import { UploadExistenceDirective } from './create/upload-existence.directive';
import { YouTubeEvidenceComponent } from './create/youtube-evidence.component';
import { YouTubeEvidenceEventComponent } from './youtube-evidence-event.component';
import { YouTubeEvidenceDetailsComponent } from './details/youtube-evidence-details.component';
import { YouTubeEvidencesContractService } from './youtube-evidences-contract.service';
import { OraclizeQueryEventComponent } from './oraclize-query-event.component';

@NgModule({
  declarations: [
    UploadEvidenceComponent,
    UploadEvidenceEventComponent,
    UploadEvidenceDetailsComponent,
    UploadExistenceDirective,
    YouTubeEvidenceComponent,
    YouTubeEvidenceEventComponent,
    YouTubeEvidenceDetailsComponent,
    OraclizeQueryEventComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UtilModule,
    AlertsModule
  ],
  exports: [
    UploadEvidenceComponent,
    UploadEvidenceDetailsComponent,
    YouTubeEvidenceComponent,
    YouTubeEvidenceDetailsComponent
  ],
  providers: [
    UploadEvidencesContractService,
    YouTubeEvidencesContractService
  ],
  bootstrap: [ UploadEvidenceEventComponent, YouTubeEvidenceEventComponent, OraclizeQueryEventComponent ]
})
export class EvidencesModule { }
