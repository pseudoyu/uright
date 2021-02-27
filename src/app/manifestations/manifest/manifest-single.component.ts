import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../../alerts/alerts.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { Web3Service } from '../../util/web3.service';
import { IpfsService } from '../../util/ipfs.service';
import { ManifestationsContractService } from '../manifestations-contract.service';
import { Manifestation } from '../manifestation';
import { NgForm } from '@angular/forms';
import { ManifestEventComponent } from '../manifest-event.component';

@Component({
  selector: 'app-manifest-single',
  templateUrl: './manifest-single.component.html',
  styleUrls: ['./manifest-single.component.css']
})
export class ManifestSingleComponent implements OnInit {
  account: string;
  manifestation = new Manifestation();
  status = 'Register';
  uploadToIpfs = true;

  constructor(private web3Service: Web3Service,
              private ipfsService: IpfsService,
              private manifestationsContractService: ManifestationsContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.getSelectedAccount()
      .subscribe(account => this.account = account );
  }

  loadFile(event) {
    if (event.files.length > 0) {
      this.status = 'Loading...';
      this.ipfsService.uploadFile(event.files[0], this.uploadToIpfs)
      .subscribe((hash: string) => {
        this.status = 'Register';
        this.manifestation.hash = hash;
      }, error => {
        this.status = 'Register';
        this.alertsService.error(error);
      });
    } else {
      this.manifestation.hash = '';
    }
  }

  manifest(form: NgForm) {
    this.manifestationsContractService.manifest(this.manifestation, this.account)
      .subscribe(result => {
        if (typeof result === 'string') {
          console.log('Transaction hash: ' + result);
          this.alertsService.info('Registration submitted, you will be alerted when confirmed.<br>' +
            'Receipt: <a target="_blank" href="https://ropsten.etherscan.io/tx/' + result + '">' + result + '</a>');
          form.reset();
        } else {
          console.log(result);
          this.alertsService.modal(ManifestEventComponent, result);
        }
      }, error => {
        this.alertsService.error(error);
      });
  }
}
