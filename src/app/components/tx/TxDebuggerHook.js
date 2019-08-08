import { useEffect, useContext } from 'react';
import Web3Service from "../../../services/Web3Service";
import * as calculators from "../../../utils/calculators";
import { ETHER_ADDRESS } from "../../../config/app";
import { NETWORK_ADDRESS } from "../../../config/env";
import { validateTxHash } from "../../../utils/validators";
import { AppContext } from "../../reducers";
import { setTxStep, setTxError, setTxDebuggingCompleted } from "../../actions/txAction";

export default function useTxDebugger(txHash) {
  const { tx, txDispatch } = useContext(AppContext);

  useEffect(() => {
    async function debugTxHash() {
      try {
        if (!verifyTxHash()) return;

        const web3Service = new Web3Service();

        const txData = await verifyValidTransaction(web3Service);
        if (!txData) return;

        const txValue = txData.value;
        const txOwner = txData.from;
        const txGasPrice = txData.gasPrice;
        const txBlockNumber = txData.blockNumber;
        const txInput = txData.input;

        const receipt = await web3Service.txMined(txHash);

        if (!verifyContractAddress(receipt.to)) return;

        const tradeData = await verifyTradeFunction(web3Service, txInput);
        if (!tradeData) return;

        if (receipt && receipt.status) {
          txDispatch(setTxDebuggingCompleted());
          return;
        }

        const source = tradeData[0].value;
        const srcAmount = tradeData[1].value;
        const dest = tradeData[2].value;
        const maxDestAmount = tradeData[4].value;
        const minConversionRate = tradeData[5].value;

        verifySourceAmount(srcAmount);
        verifyGasUsed(web3Service, receipt, txData.gas);
        await verifyGasPrice(web3Service, txBlockNumber, txGasPrice);

        if (source !== ETHER_ADDRESS) {
          verifyEtherValue(txValue);
          await verifyAllowance(web3Service, source, txOwner, txBlockNumber, srcAmount);
          await verifyBalance(web3Service, source, txOwner, txBlockNumber, srcAmount);
          txDispatch(setTxError('etherAmount', ''));
        } else {
          txDispatch(setTxError('etherValue', ''));
          txDispatch(setTxError('allowance', ''));
          txDispatch(setTxError('balance', ''));
          verifyEtherAmount(txValue, srcAmount);
        }

        await verifyUserCap(web3Service, source, srcAmount, dest, maxDestAmount, txOwner, txBlockNumber);

        const rates = await verifyRate(web3Service, source, dest, srcAmount, txBlockNumber);

        if (!rates) return;

        verifyMinConversionRate(rates, minConversionRate);
      } catch (error) {
        console.log(error);
      }

      txDispatch(setTxDebuggingCompleted());
    }

    function verifyContractAddress(contractAddress) {
      txDispatch(setTxStep(tx.errors.contract.step));

      if (contractAddress !== NETWORK_ADDRESS) {
        txDispatch(setTxError('contract', `Contract Address of the Transaction should be Kyber Network Proxy Contract (${NETWORK_ADDRESS}).`));
        txDispatch(setTxDebuggingCompleted());
        return false;
      }

      txDispatch(setTxError('contract', ''));

      return true;
    }

    async function verifyValidTransaction(web3Service) {
      try {
        txDispatch(setTxStep(tx.errors.txNotFound.step));

        const txData = await web3Service.getTx(txHash);

        if (!txData) {
          txDispatch(setTxError('txNotFound', 'The Transaction cannot be found.'));
          txDispatch(setTxDebuggingCompleted());
          return false
        }

        txDispatch(setTxError('txNotFound', ''));
        return txData;
      } catch (e) {
        console.log(e);
        return setStateOnError('txNotFound');
      }
    }

    function verifyTxHash() {
      txDispatch(setTxStep(tx.errors.tx.step));

      if (!validateTxHash(txHash)) {
        txDispatch(setTxError('tx', 'Your transaction hash is invalid.'));
        txDispatch(setTxDebuggingCompleted());
        return false;
      }

      txDispatch(setTxError('tx', ''));

      return true;
    }

    function verifyGasUsed(web3Service, receipt, gas) {
      txDispatch(setTxStep(tx.errors.gasUsed.step));

      const transaction = {
        gasUsed: receipt.gasUsed,
        status: receipt.status,
        gas: gas
      };

      if ((!transaction.status || transaction.status === "0x0") && (transaction.gas !== 0 && (transaction.gasUsed / transaction.gas >= 0.95))) {
        txDispatch(setTxError('gasUsed', 'The Transaction is run out of Gas.'));
        return false;
      }

      txDispatch(setTxError('gasUsed', ''));
      return true;
    }

    function verifyEtherValue(txValue) {
      txDispatch(setTxStep(tx.errors.etherValue.step));
      if (calculators.compareTwoNumber(txValue, 0) === 1) {
        txDispatch(setTxError('etherValue', 'Sending ETH as a value while trading a token to ETH.'));
        return false;
      }

      txDispatch(setTxError('etherValue', ''));
      return true;
    }

    async function verifyAllowance(web3Service, source, txOwner, txBlockNumber, srcAmount) {
      try {
        txDispatch(setTxStep(tx.errors.allowance.step));

        const remainStr = await web3Service.getAllowanceAtSpecificBlock(source, txOwner, txBlockNumber);

        if (calculators.compareTwoNumber(remainStr, srcAmount) === -1) {
          txDispatch(setTxError('allowance', 'The Sender Wallet Allowance is lower than Source Amount.'));
          return false;
        }

        txDispatch(setTxError('allowance', ''));
        return true;
      } catch (e) {
        console.log(e);
        return setStateOnError('allowance');
      }
    }

    async function verifyBalance(web3Service, source, txOwner, txBlockNumber, srcAmount) {
      try {
        txDispatch(setTxStep(tx.errors.balance.step));

        const balance = await web3Service.getTokenBalanceAtSpecificBlock(source, txOwner, txBlockNumber);

        if (calculators.compareTwoNumber(balance, srcAmount) === -1) {
          txDispatch(setTxError('balance', 'Token Balance is lower than Source Amount.'));
          return false;
        }

        txDispatch(setTxError('balance', ''));
        return true;
      } catch (e) {
        console.log(e);
        return setStateOnError('balance');
      }
    }

    function verifyEtherAmount(txValue, srcAmount) {
      txDispatch(setTxStep(tx.errors.etherAmount.step));

      if (calculators.compareTwoNumber(txValue, srcAmount) !== 0) {
        txDispatch(setTxError('etherAmount', 'The Transaction did not contain the exact amount of ETH.'));
        return false;
      }

      txDispatch(setTxError('etherAmount', ''));
      return true;
    }

    async function verifyUserCap(web3Service, source, srcAmount, dest, maxDestAmount, txOwner, txBlockNumber) {
      try {
        txDispatch(setTxStep(tx.errors.userCap.step));

        const amountToCheckCap = source === ETHER_ADDRESS ? srcAmount : dest === ETHER_ADDRESS ? maxDestAmount : false;

        if (amountToCheckCap) {
          const userCap = await web3Service.getMaxCapAtSpecificBlock(txOwner, txBlockNumber);
          if (calculators.compareTwoNumber(amountToCheckCap, userCap) === 1) {
            txDispatch(setTxError('userCap', 'Source Amount exceeds User Cap.'));
            return false;
          }
        }

        txDispatch(setTxError('userCap', ''));
        return true;
      } catch (e) {
        console.log(e);
        return setStateOnError('userCap');
      }
    }

    async function verifyRate(web3Service,source, dest, srcAmount, txBlockNumber) {
      try {
        txDispatch(setTxStep(tx.errors.rate.step));

        const rates = await web3Service.getRateAtSpecificBlock(source, dest, srcAmount, txBlockNumber);

        if (calculators.compareTwoNumber(rates.expectedPrice, 0) === 0) {
          txDispatch(setTxError('rate', 'Rate is zero at execution time.'));
          txDispatch(setTxDebuggingCompleted());
          return false;
        }

        txDispatch(setTxError('rate', ''));
        return rates;
      } catch (e) {
        console.log(e);
        return setStateOnError('rate');
      }
    }

    function verifyMinConversionRate(rates, minConversionRate) {
      txDispatch(setTxStep(tx.errors.minRate.step));

      if (calculators.compareTwoNumber(minConversionRate, rates.expectedPrice) === 1) {
        txDispatch(setTxError('minRate', 'The Transaction Min Conversion Rate is higher than Execution Rate.'));
        return false;
      }

      txDispatch(setTxError('minRate', ''));
      return true;
    }

    async function verifyTradeFunction(web3Service, txInput) {
      try {
        txDispatch(setTxStep(tx.errors.tradeFunction.step));
        const tradeData = await web3Service.exactTradeData(txInput);

        if (!tradeData) {
          txDispatch(setTxError('tradeFunction', 'The Transaction is not calling Kyber Trading Function.'));
          txDispatch(setTxDebuggingCompleted());
          return false;
        }

        txDispatch(setTxError('tradeFunction', ''));
        return tradeData;
      } catch(e) {
        let errorMessage = false;

        if (e.message === 'overflow (operation="setValue", fault="overflow", details="Number can only safely store up to 53 bits")') {
          errorMessage = "The Transaction might be failed because of a very long value passed to a parameter with type of Bytes like Hint.";
        }

        return setStateOnError('tradeFunction', errorMessage);
      }
    }

    async function verifyGasPrice(web3Service, txBlockNumber, txGasPrice) {
      try {
        txDispatch(setTxStep(tx.errors.gasPrice.step));
        const gasCap = await web3Service.wrapperGetGasCap(txBlockNumber);

        if (calculators.compareTwoNumber(txGasPrice, gasCap) === 1) {
          txDispatch(setTxError('gasPrice', 'Gas Price exceeds Gas Limit.'));
          return false;
        }

        txDispatch(setTxError('gasPrice', ''));
        return true;
      } catch (e) {
        console.log(e);
        return setStateOnError('gasPrice');
      }
    }

    function verifySourceAmount(srcAmount) {
      txDispatch(setTxStep(tx.errors.sourceAmount.step));

      if (calculators.compareTwoNumber(srcAmount, 0) !== 1) {
        txDispatch(setTxError('sourceAmount', 'Source Amount cannot be zero.'));
        return false;
      }

      txDispatch(setTxError('sourceAmount', ''));
      return true;
    }

    function setStateOnError(key, error = false) {
      error = error ? error : 'Unknown Error: The Transaction can not be debugged since something unexpected, even to us, happens.';
      txDispatch(setTxError(key, error));
      txDispatch(setTxDebuggingCompleted());
      return false;
    }

    debugTxHash();

    // eslint-disable-next-line
  }, [txHash]);

  return null;
}
