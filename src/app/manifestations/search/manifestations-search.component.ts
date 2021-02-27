import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { AlertsService } from '../../alerts/alerts.service';
import { Web3Service } from '../../util/web3.service';
import { ManifestationsContractService } from '../manifestations-contract.service';
import { Manifestation } from '../manifestation';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manifestations-search',
  templateUrl: './manifestations-search.component.html',
  styleUrls: ['./manifestations-search.component.css']
})
export class ManifestationsSearchComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  manifestation = new Manifestation();

  constructor(private web3Service: Web3Service,
              private manifestationsContractService: ManifestationsContractService,
              private alertsService: AlertsService) {}

  ngOnInit(): void { }

  getManifestation(hash: string) {
    this.manifestationsContractService.getManifestation(hash).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((manifestation: Manifestation) => {
        this.manifestation = manifestation;
        if (!this.manifestation.title) {
          this.alertsService.info('Content hash not found, unregistered');
        }
      }, error => {
        this.alertsService.error(error);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
