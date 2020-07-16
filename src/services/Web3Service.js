import Web3 from "web3";
import { ERC20_ABI } from "../config/app";
import * as calculators from "../utils/calculators";

export default class Web3Service {
  constructor(props) {
    this.proxyAddress = props.proxyAddress;
    this.proxyABI = props.proxyABI;
    this.web3 = new Web3(new Web3.providers.HttpProvider(props.nodeUrl));
    this.erc20Contract = new this.web3.eth.Contract(ERC20_ABI);
    this.proxyContract = new this.web3.eth.Contract(this.proxyABI, this.proxyAddress);
  }

  getTx(txHash) {
    return new Promise((resolve, reject) => {
      try {
        this.web3.eth.getTransaction(txHash).then((result) => {
          if (result != null) {
            resolve(result);
          } else {
            resolve(false);
          }
        })
      } catch (e) {
        reject(e);
      }
    })
  }

  exactTradeData(data) {
    return new Promise((resolve, reject) => {
      try {
        const tradeAbi = this.getAbiByName("tradeWithHint", this.proxyABI);
        let decoded = this.decodeMethod(tradeAbi, data);

        if (!decoded) {
          const tradeAbi = this.getAbiByName("trade", this.proxyABI);
          decoded = this.decodeMethod(tradeAbi, data);
        }

        if (!decoded) {
          const tradeAbi = this.getAbiByName("tradeWithHintAndFee", this.proxyABI);
          decoded = this.decodeMethod(tradeAbi, data);
        }

        if (decoded) {
          resolve(decoded.params);
        } else {
          resolve(false);
        }
      } catch (e) {
        reject(e);
      }
    });
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
      const data = this.proxyContract.methods.maxGasPrice().encodeABI();
      this.web3.eth.call({
        to: this.proxyAddress,
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
    const data = tokenContract.methods.allowance(owner, this.proxyAddress).encodeABI();

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

  getRateAtSpecificBlock(source, dest, srcAmount, blockNumber) {
    srcAmount = calculators.toHex(srcAmount);
    const data = this.proxyContract.methods.getExpectedRate(source, dest, srcAmount).encodeABI();

    return new Promise((resolve, reject) => {
      this.web3.eth.call({
        to: this.proxyAddress,
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
