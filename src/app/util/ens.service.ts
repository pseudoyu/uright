import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Web3Service } from './web3.service';

import ENS from 'ethereum-ens';
declare const require: any;
const localENS = require('../../assets/contracts/ENSRegistry.json');

@Injectable({
  providedIn: 'root'
})
export class EnsService {

  private deployedContract = new ReplaySubject<any>(1);

  constructor(private web3Service: Web3Service,
              private ngZone: NgZone) {
    this.web3Service.networkId.subscribe(network_id => {
      if (network_id > 4) {
        if (localENS.networks[network_id]) {
          const deployedAddress = localENS.networks[network_id].address;
          this.deployedContract.next(
            new ENS(this.web3Service.web3.eth.currentProvider, deployedAddress));
        } else {
          this.deployedContract.error(new Error('ENSRegistry contract ' +
            'not found in current network with id ' + network_id));
        }
      } else {
        this.deployedContract.next(new ENS(this.web3Service.web3.eth.currentProvider));
      }
    });
  }

  public reverse(address: string): Observable<string> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.reverse(address).name()
        .then(name => {
          this.ngZone.run(() => {
            observer.next(name);
            observer.complete();
          });
        })
        .catch(error => {
          this.ngZone.run(() => {
            observer.next(address.slice(0, 6) + '...' + address.slice(-4));
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => {
        observer.next(address.slice(0, 6) + '...' + address.slice(-4));
        observer.complete();
      }));
      return { unsubscribe() {} };
    });
  }
}
