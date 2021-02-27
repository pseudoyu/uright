import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import IPFS_API from 'ipfs-api';

declare const Buffer;

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  private ipfsApi: any;

  constructor(private ngZone: NgZone) {
    this.ipfsApi = IPFS_API('ipfs.infura.io', '5001', {protocol: 'https'});
  }

  public uploadFile (file, uploadToIpfs): Observable<string> {
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        const reader = new FileReader();
        reader.onprogress = (progress) => console.log(`Loaded: ${progress.loaded}/${progress.total}`);
        reader.onloadend = () => {
          this.saveToIpfs(reader, uploadToIpfs).subscribe((hash: string) => {
            this.ngZone.run(() => {
              observer.next(hash);
              observer.complete();
            });
          }, error => this.ngZone.run(() => observer.error(error)) );
        };
        reader.readAsArrayBuffer(file);
      });
      return { unsubscribe() {} };
    });
  }

  private saveToIpfs(reader, uploadToIpfs): Observable<string> {
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        const buffer = Buffer.from(reader.result);
        this.ipfsApi.add(buffer, {onlyHash: !uploadToIpfs, progress: (progress) => console.log(`Saved: ${progress}`)})
        .then((response) => {
          console.log(`IPFS_ID: ${response[0].hash}`);
          observer.next(response[0].hash);
          observer.complete();
        })
        .catch((err) => {
          console.error(err);
          observer.error(new Error('Error uploading file, see logs for details'));
        });
      });
      return { unsubscribe() {} };
    });
  }
}
