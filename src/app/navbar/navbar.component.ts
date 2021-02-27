import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { filter, takeUntil } from 'rxjs/operators';
import { Web3Service } from '../util/web3.service';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public isCollapsed: boolean;
  public account: string;
  public accountsNames: string[];
  public accounts: string[];

  constructor(private web3Service: Web3Service,
              private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.isCollapsed = true;
    this.authenticationService.getAccounts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(accounts =>  this.accounts = accounts );
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(filter(account => account !== ''))
      .subscribe(account =>  this.account = account );
    this.authenticationService.getAccountsNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(accountsNames =>  this.accountsNames = accountsNames );
  }

  refreshAccounts() {
    this.authenticationService.refreshAccounts();
  }

  onChange(selectedAccount: string) {
    this.authenticationService.setSelectedAccount(selectedAccount);
  }

  getCurrentNetwork(): Observable<string> {
    return this.web3Service.getNetworkName();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
