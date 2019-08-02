import Web3 from "web3";
import { KYBER_NETWORK_ABI, ERC20_ABI} from "../config/app";
import { RESERVE_ADDRESS, NETWORK_ADDRESS } from "../config/env";
import * as calculators from "../utils/calculators";

export default class Web3Service {
  constructor() {
    this.web3 = new Web3(Web3.givenProvider);
    this.erc20Contract = new this.web3.eth.Contract(ERC20_ABI);
    this.networkContract = new this.web3.eth.Contract(KYBER_NETWORK_ABI, NETWORK_ADDRESS);
  }

  getTx(txHash) {
    return new Promise((resolve, rejected) => {
      this.web3.eth.getTransaction(txHash).then((result) => {
        if (result != null) {
          resolve(result);
        } else {
          rejected(new Error("Cannot get tx hash"));
        }
      })
    })
  }

  exactTradeData(data) {
    return new Promise((resolve, reject) => {
      try {
        const tradeAbi = this.getAbiByName("tradeWithHint", KYBER_NETWORK_ABI);
        const decoded = this.decodeMethod(tradeAbi, data);
        resolve(decoded.params);
      } catch (e) {
        reject(e);
      }
    });
  }

  getListReserve() {
    return Promise.resolve([RESERVE_ADDRESS])
  }

  txMined(hash) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransactionReceipt(hash).then((result) => {
        resolve(result);
      }).catch(err => {
        reject(err);
      })
    })
  }

  wrapperGetGasCap(blockNumber) {
    return new Promise((resolve, reject) => {
      const data = this.networkContract.methods.maxGasPrice().encodeABI();
      this.web3.eth.call({
        to: NETWORK_ADDRESS,
        data: data
      }, blockNumber)
        .then(result => {
          var gasCap = this.web3.eth.abi.decodeParameters(['uint256'], result);
          resolve(gasCap[0]);
        }).catch((err) => {
        reject(err);
      })
    })
  }

  getAllowanceAtSpecificBlock(sourceToken, owner, blockNumber) {
    let tokenContract = this.erc20Contract;
    tokenContract.options.address = sourceToken;
    const data = tokenContract.methods.allowance(owner, NETWORK_ADDRESS).encodeABI();

    return new Promise((resolve, reject) => {
      this.web3.eth.call({
        to: sourceToken,
        data: data
      }, blockNumber)
        .then(result => {
          const allowance = this.web3.eth.abi.decodeParameters(['uint256'], result);
          resolve(allowance[0])
        }).catch((err) => {
        reject(err)
      })
    })
  }

  getTokenBalanceAtSpecificBlock(address, ownerAddr, blockNumber) {
    let instance = this.erc20Contract;
    instance.options.address = address;
    const data = instance.methods.balanceOf(ownerAddr).encodeABI();

    return new Promise((resolve, reject) => {
      this.web3.eth.call({
        to: address,
        data: data
      }, blockNumber)
        .then(result => {
          const balance = this.web3.eth.abi.decodeParameters(['uint256'], result);
          resolve(balance[0])
        }).catch((err) => {
        reject(err)
      })
    })
  }

  getMaxCapAtSpecificBlock(address, blockNumber) {
    const data = this.networkContract.methods.getUserCapInWei(address).encodeABI();

    return new Promise((resolve, reject) => {
      this.web3.eth.call({
        to: NETWORK_ADDRESS,
        data: data
      }, blockNumber)
        .then(result => {
          var cap = this.web3.eth.abi.decodeParameters(['uint256'], result);
          resolve(cap[0])
        }).catch((err) => {
        reject(err)
      })
    })
  }

  getRateAtSpecificBlock(source, dest, srcAmount, blockNumber) {
    const mask = calculators.maskNumber();
    let srcAmountEnableFistBit = calculators.sumOfTwoNumber(srcAmount,  mask);
    srcAmountEnableFistBit = calculators.toHex(srcAmountEnableFistBit);
    const data = this.networkContract.methods.getExpectedRate(source, dest, srcAmountEnableFistBit).encodeABI();

    return new Promise((resolve, reject) => {
      this.web3.eth.call({
        to: NETWORK_ADDRESS,
        data: data
      }, blockNumber)
        .then(result => {
          if (result === "0x") {
            resolve({ expectedPrice: "0", slippagePrice: "0"});
            return
          }

          try {
            const rates = this.web3.eth.abi.decodeParameters([
              { type: 'uint256', name: 'expectedPrice'},
              { type: 'uint256', name: 'slippagePrice'}
            ], result);

            resolve(rates);
          } catch (e) {
            reject(e)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  getAbiByName(name, abi) {
    for (let value of abi) {
      if (value.name === name) {
        return [value]
      }
    }
    return false
  }

  decodeMethod(abiArray, data) {
    const state = {
      savedABIs: [],
      methodIDs: {}
    };

    if (Array.isArray(abiArray)) {
      abiArray.map(abi => {
        if (abi.name) {
          const signature = this.web3.utils.sha3(
            `${abi.name}(${abi.inputs.map(item => item.type).join(",")})`
          );

          if (abi.type === "event") {
            state.methodIDs[signature.slice(2)] = abi;
          } else {
            state.methodIDs[signature.slice(2, 10)] = abi;
          }
        }

        return '';
      });

      state.savedABIs = state.savedABIs.concat(abiArray);
    } else {
      throw new Error("Expected ABI array, got " + typeof abiArray);
    }

    const methodID = data.slice(2, 10);
    const abiItem = state.methodIDs[methodID];
    if (abiItem) {
      const params = abiItem.inputs.map(item => ({
        type: item.type,
        name: item.name
      }));
      let decoded = this.web3.eth.abi.decodeParameters(params, "0x" + data.slice(10));
      let retData = {
        name: abiItem.name,
        params: []
      };

      Object.keys(decoded).forEach(key => {
        const foundItems = abiItem.inputs.filter(t => t.name === key);
        if (foundItems.length > 0) {
          const field = foundItems[0];
          const isUint = field.type.indexOf("uint") === 0;
          const isInt = field.type.indexOf("int") === 0;
          const isAddress = field.type.indexOf("address") === 0;
          const param = decoded[field.name];
          let parsedParam = param;

          if (isUint || isInt) {
            const isArray = Array.isArray(param);

            if (isArray) {
              parsedParam = param.map(val => this.web3.utils.toBN(val).toString());
            } else {
              parsedParam = this.web3.utils.toBN(param).toString();
            }
          }

          if (isAddress) {
            const isArray = Array.isArray(param);

            if (isArray) {
              parsedParam = param.map(val => val.toLowerCase());
            } else {
              parsedParam = param.toLowerCase();
            }
          }

          retData.params.push({
            name: field.name,
            value: parsedParam,
            type: field.type
          });
        }
      });

      return retData;
    }
  }
}
