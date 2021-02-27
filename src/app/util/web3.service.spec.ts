import {TestBed, inject} from '@angular/core/testing';
import {Web3Service} from './web3.service';
// import Web3 from 'web3';

declare let require: any;
declare let window: any;
const Web3 = require('web3');
const TRUFFLE_CONFIG = require('../../../truffle');

describe('Web3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3Service]
    });
  });

  it('should be created', inject([Web3Service], (service: Web3Service) => {
    expect(service).toBeTruthy();
  }));

  it('should set development local node as Web3 provider',
    inject([Web3Service], (service: Web3Service) => {
      if (service.useWebSockets) {
        const localNode = 'ws://' + TRUFFLE_CONFIG.networks.development.host + ':' +
          TRUFFLE_CONFIG.networks.development.port + '/';
        expect(service.web3.currentProvider.connection.url).toBe(localNode);
      } else {
        const localNode = 'http://' + TRUFFLE_CONFIG.networks.development.host + ':' +
          TRUFFLE_CONFIG.networks.development.port;
        expect(service.web3.currentProvider.host).toBe(localNode);
      }
    })
  );
});

describe('Web3Service', () => {
  beforeEach(() => {
    window.web3 = {
      currentProvider: new Web3.providers.HttpProvider('http://localhost:1337')
    };
    TestBed.configureTestingModule({
      providers: [Web3Service]
    });
  });

  it('should be created', inject([Web3Service], (service: Web3Service) => {
    expect(service).toBeTruthy();
  }));

  it('should set provided node as Web3 provider',
    inject([Web3Service], (service: Web3Service) => {
      expect(service.web3.currentProvider.host).toBe('http://localhost:1337');
    })
  );
});
