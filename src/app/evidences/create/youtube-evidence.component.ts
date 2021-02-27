import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertsService } from '../../alerts/alerts.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { Web3Service } from '../../util/web3.service';
import { IpfsService } from '../../util/ipfs.service';
import { YouTubeEvidencesContractService } from '../youtube-evidences-contract.service';
import { NgForm } from '@angular/forms';
import { YouTubeEvidence } from '../youtubeEvidence';
import { Manifestation } from '../../manifestations/manifestation';
import { ManifestEventComponent } from '../../manifestations/manifest-event.component';
import { OraclizeQueryEvent } from '../oraclize-query-event';
import { OraclizeQueryEventComponent } from '../oraclize-query-event.component';

@Component({
  selector: 'app-youtube-evidence',
  templateUrl: './youtube-evidence.component.html',
  styleUrls: ['./youtube-evidence.component.css']
})
export class YouTubeEvidenceComponent implements OnInit {
  @Input() manifestation: Manifestation;
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() done: EventEmitter<void> = new EventEmitter();

  account: string;
  youtubeEvidence = new YouTubeEvidence();
  price = 0;
  stake = 2.5;
  linkedFromYouTube = false;

  constructor(private web3Service: Web3Service,
              private ipfsService: IpfsService,
              private youtubeEvidencesContractService: YouTubeEvidencesContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.youtubeEvidence.evidencedId = this.manifestation.hash;
    this.authenticationService.getSelectedAccount()
      .subscribe(account => this.account = account );
    this.youtubeEvidencesContractService.getPrice()
      .subscribe(price => this.price = price);
  }

  addEvidence(form: NgForm) {
    this.youtubeEvidencesContractService.addEvidence(this.youtubeEvidence, this.account, this.price)
    .subscribe(result => {
      if (typeof result === 'string') {
        console.log('Transaction hash: ' + result);
        this.alertsService.info('Evidence submitted, you will be alerted when confirmed.<br>' +
          'Receipt: <a target="_blank" href="https://ropsten.etherscan.io/tx/' + result + '">' + result + '</a>');
        form.reset();
        this.done.emit();
      } else {
        console.log(result);
        this.alertsService.modal(OraclizeQueryEventComponent, result);
      }
    }, error => {
      this.alertsService.error(error);
    });
  }

  cancelEvidence() {
    this.cancel.emit();
  }
}
