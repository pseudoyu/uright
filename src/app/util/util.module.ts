import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './web3.service';
import { IpfsService } from './ipfs.service';
import { EnsService } from './ens.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    Web3Service, IpfsService, EnsService
  ]
})
export class UtilModule { }
