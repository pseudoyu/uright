import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManifestEvent } from './manifestations/manifest-event';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { ManifestationsContractService } from './manifestations/manifestations-contract.service';
import { AlertsService } from './alerts/alerts.service';
import { Web3Service } from './util/web3.service';
import { Subject } from 'rxjs/internal/Subject';
import { AuthenticationService } from './navbar/authentication.service';
import { ManifestEventComponent } from './manifestations/manifest-event.component';
import { YouTubeEvidencesContractService } from './evidences/youtube-evidences-contract.service';
import { YouTubeEvidenceEvent } from './evidences/youtube-evidence-event';
import { YouTubeEvidenceEventComponent } from './evidences/youtube-evidence-event.component';
import { UploadEvidencesContractService } from './evidences/upload-evidences-contract.service';
import { UploadEvidenceEvent } from './evidences/upload-evidence-event';
import { UploadEvidenceEventComponent } from './evidences/upload-evidence-event.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private web3Service: Web3Service,
              private manifestationsContractService: ManifestationsContractService,
              private youTubeEvidencesContractService: YouTubeEvidencesContractService,
              private uploadEvidencesContractService: UploadEvidencesContractService,
              private authenticationService: AuthenticationService,
              private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe), filter(account => account !== ''))
      .subscribe((account: string) => {
        this.watchManifestEvents(account);
        this.watchUploadEvidenceEvents(account);
        this.watchYouTubeEvidenceEvents(account);
      });
  }

  watchManifestEvents(account) {
    this.manifestationsContractService.watchManifestEvents(account)
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged( // Avoid repeated event firing with Metamask
        (prev, curr) => prev.when.valueOf() === curr.when.valueOf()))
      .subscribe( (event: ManifestEvent) => {
        console.log(event);
        this.alertsService.modal(ManifestEventComponent, event);
      }, error => {
       console.log(error.toString());
      });
  }

  watchYouTubeEvidenceEvents(account) {
    this.youTubeEvidencesContractService.watchEvidenceEvents(account)
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged( // Avoid repeated event firing with Metamask
        (prev, curr) => prev.when.valueOf() === curr.when.valueOf()))
      .subscribe( (event: YouTubeEvidenceEvent) => {
        console.log(event);
        this.alertsService.modal(YouTubeEvidenceEventComponent, event);
      }, error => {
        console.log(error.toString());
      });
  }

  watchUploadEvidenceEvents(account) {
    this.uploadEvidencesContractService.watchEvidenceEvents(account)
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged( // Avoid repeated event firing with Metamask
        (prev, curr) => prev.when.valueOf() === curr.when.valueOf()))
      .subscribe( (event: UploadEvidenceEvent) => {
        console.log(event);
        this.alertsService.modal(UploadEvidenceEventComponent, event);
      }, error => {
        console.log(error.toString());
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
