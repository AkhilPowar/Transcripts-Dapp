import { Injectable } from '@angular/core';
import { ConnectService } from './connect.service';

const QRCode = require('qrcode');

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  constructor(
    private connectService: ConnectService
  ) { }

  calculateGas(data: string) {
    return 21000 + (68 * (data.length - 2) / 2);
  }

  getTransactionUrl(address: string, data: any, gas: number): string {
    let request = 'ethereum:';
    request += address;
    request += '/';
    request += data._method.name;
    request += '?';
    if (data.arguments.length !== 0) {
      for (let i = 0; i < data.arguments.length; i++) {
        request += data._method.inputs[i].type;
        request += '=';
        request += data.arguments[i];
        request += '&';
      }
    }
    request += 'gas=';
    request += gas;
    return request;
  }

  viewContract(address: string, abi: object) {
    const web3 = this.connectService.getWeb3();
    const contract = new web3.eth.Contract(abi, address);
    console.log(contract);
    return contract;
  }

  async updateContract(address: string, txnData: any) {
    console.log(txnData);
    const rawTxn = txnData.encodeABI();
    console.log(rawTxn);
    const gas = this.calculateGas(rawTxn);
    console.log(gas);
    const url = this.getTransactionUrl(address, txnData, gas);
    console.log(url);
    QRCode.toCanvas(url).then(qr => {
      document.getElementById('qr').appendChild(qr);
    });
  }

  async createContract(name: string, args?: any[]) {
    // ContractFactory address: 0x03af9b1553a7075663bfe641d5cfe3c453ff5a4d
    const address = '0x03af9b1553a7075663bfe641d5cfe3c453ff5a4d';
    // tslint:disable-next-line:max-line-length
    const abi = [ { 'anonymous': false, 'inputs': [ { 'indexed': false, 'name': 'creator', 'type': 'address' } ], 'name': 'IdentityContractCreated', 'type': 'event' }, { 'anonymous': false, 'inputs': [ { 'indexed': false, 'name': 'creator', 'type': 'address' }, { 'indexed': false, 'name': 'owner', 'type': 'address' }, { 'indexed': false, 'name': 'provider', 'type': 'address' }, { 'indexed': false, 'name': 'name', 'type': 'string' }, { 'indexed': false, 'name': 'id', 'type': 'string' }, { 'indexed': false, 'name': 'courseName', 'type': 'string' }, { 'indexed': false, 'name': 'startYear', 'type': 'uint256' }, { 'indexed': false, 'name': 'completionYear', 'type': 'uint256' } ], 'name': 'TranscriptApplicationContractCreated', 'type': 'event' }, { 'constant': false, 'inputs': [], 'name': 'createIdentityContract', 'outputs': [ { 'name': 'idContractAddress', 'type': 'address' } ], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': false, 'inputs': [ { 'name': 'owner', 'type': 'address' }, { 'name': 'provider', 'type': 'address' }, { 'name': 'name', 'type': 'string' }, { 'name': 'id', 'type': 'string' }, { 'name': 'courseName', 'type': 'string' }, { 'name': 'startYear', 'type': 'uint256' }, { 'name': 'completionYear', 'type': 'uint256' } ], 'name': 'createTranscriptApplicationContract', 'outputs': [ { 'name': 'transcriptApplicationAddress', 'type': 'address' } ], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' } ];

    const contractFactory = this.viewContract(address, abi);

    let data: any;
    if (name === 'identity') {
      data = await contractFactory.methods.createIdentityContract();
    } else if (name === 'transcriptApplication') {
      data = await contractFactory.methods.createTranscriptApplicationContract(
        args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    console.log(data);

    const gas = this.calculateGas(data);
    console.log(gas);
    const url = this.getTransactionUrl(address, data, 1500000);
    console.log(url);
    QRCode.toCanvas(url).then(qr => {
      document.getElementById('qr').appendChild(qr);
    });
  }
}
