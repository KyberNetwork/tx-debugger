import { useEffect, useContext } from 'react';
import Web3Service from "../../../services/Web3Service";
import * as calculators from "../../../utils/calculators";
import { ETHER_ADDRESS } from "../../../config/app";
import { validateTxHash } from "../../../utils/validators";
import { AppContext } from "../../reducers";
import { setTxStep, setTxError, setTxDebuggingCompleted } from "../../actions/txAction";

export default function useTxDebugger(txHash) {
  const { tx, txDispatch } = useContext(AppContext);

  useEffect(() => {
    function verifyTxHash() {
      txDispatch(setTxStep(tx.errors.tx.step));
      if (!validateTxHash(txHash)) {
        txDispatch(setTxError('tx', 'Your transaction hash is invalid.'));
        return false;
      }

      txDispatch(setTxError('tx', ''));
      return true;
    }

    async function verifyGasUsed(web3Service, gas) {
      txDispatch(setTxStep(tx.errors.gasUsed.step));
      const receipt = await web3Service.txMined(txHash);
      const transaction = {
        gasUsed: receipt.gasUsed,
        status: receipt.status,
        gas: gas
      };

      if ((!transaction.status || transaction.status === "0x0") && !transaction.gas && (transaction.gasUsed / transaction.gas >= 0.95)) {
        txDispatch(setTxError('gasUsed', 'The transaction is run out of Gas.'));
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
      txDispatch(setTxStep(tx.errors.allowance.step));
      const remainStr = await web3Service.getAllowanceAtSpecificBlock(source, txOwner, txBlockNumber);
      if (calculators.compareTwoNumber(remainStr, srcAmount) === -1) {
        txDispatch(setTxError('allowance', 'The Sender Wallet Allowance is lower than source amount.'));
        return false;
      }

      txDispatch(setTxError('allowance', ''));
      return true;
    }

    async function verifyBalance(web3Service, source, txOwner, txBlockNumber, srcAmount) {
      txDispatch(setTxStep(tx.errors.balance.step));
      const balance = await web3Service.getTokenBalanceAtSpecificBlock(source, txOwner, txBlockNumber);
      if (calculators.compareTwoNumber(balance, srcAmount) === -1) {
        txDispatch(setTxError('balance', 'Token Balance is lower than Source Amount.'));
        return false;
      }

      txDispatch(setTxError('balance', ''));
      return true;
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
      const amountToCheckCap = source === ETHER_ADDRESS ? srcAmount : dest === ETHER_ADDRESS ? maxDestAmount : false;

      if (amountToCheckCap) {
        txDispatch(setTxStep(tx.errors.userCap.step));
        const userCap = await web3Service.getMaxCapAtSpecificBlock(txOwner, txBlockNumber);
        if (calculators.compareTwoNumber(amountToCheckCap, userCap) === 1) {
          txDispatch(setTxError('userCap', 'Source Amount exceeds User Cap.'));
          return false;
        }
        txDispatch(setTxError('userCap', ''));
      }

      return true;
    }

    async function verifyRate(web3Service,source, dest, srcAmount, txBlockNumber, minConversionRate) {
      txDispatch(setTxStep(tx.errors.rate.step));
      const rates = await web3Service.getRateAtSpecificBlock(source, dest, srcAmount, txBlockNumber);
      if (calculators.compareTwoNumber(rates.expectedPrice, 0) === 0) {
        txDispatch(setTxError('rate', 'Rate is zero at execution time.'));
        return false;
      } else if (calculators.compareTwoNumber(minConversionRate, rates.expectedPrice) === 1) {
        txDispatch(setTxError('rate', 'Min Rate is too high.'));
        return false;
      }

      txDispatch(setTxError('rate', ''));
      return true;
    }

    async function verifyTradeFunction(web3Service, txInput) {
      const tradeData = await web3Service.exactTradeData(txInput);

      if (!tradeData) {
        txDispatch(setTxError('tradeFunction', 'The transaction is not calling Kyber trading function.'));
        return false;
      }

      txDispatch(setTxError('tradeFunction', ''));
      return tradeData;
    }

    async function verifyGasPrice(web3Service, txBlockNumber, txGasPrice) {
      txDispatch(setTxStep(tx.errors.gasPrice.step));
      const gasCap = await web3Service.wrapperGetGasCap(txBlockNumber);

      if (calculators.compareTwoNumber(txGasPrice, gasCap) === 1) {
        txDispatch(setTxError('gasPrice', 'Gas Price exceeds Gas Limit.'));
        return false;
      }

      txDispatch(setTxError('gasPrice', ''));
      return true;
    }

    async function debugTxHash() {
      try {
        if (!verifyTxHash()) {
          txDispatch(setTxDebuggingCompleted());
          return;
        }

        const web3Service = new Web3Service();

        txDispatch(setTxStep(tx.errors.tradeFunction.step));
        const txData = await web3Service.getTx(txHash);
        const txValue = txData.value;
        const txOwner = txData.from;
        const txGasPrice = txData.gasPrice;
        const txBlockNumber = txData.blockNumber;
        const txInput = txData.input;

        const tradeData = await verifyTradeFunction(web3Service, txInput);

        if (!tradeData) {
          txDispatch(setTxDebuggingCompleted());
          return;
        }

        const source = tradeData[0].value;
        const srcAmount = tradeData[1].value;
        const dest = tradeData[2].value;
        const maxDestAmount = tradeData[4].value;
        const minConversionRate = tradeData[5].value;

        await verifyGasUsed(web3Service, txData.gas);

        await verifyGasPrice(web3Service, txBlockNumber, txGasPrice);

        if (source !== ETHER_ADDRESS) {
          verifyEtherValue(txValue);
          await verifyAllowance(web3Service, source, txOwner, txBlockNumber, srcAmount);
          await verifyBalance(web3Service, source, txOwner, txBlockNumber, srcAmount);
        } else {
          txDispatch(setTxError('etherValue', ''));
          txDispatch(setTxError('allowance', ''));
          txDispatch(setTxError('balance', ''));
          verifyEtherAmount(txValue, srcAmount);
        }

        await verifyUserCap(web3Service, source, srcAmount, dest, maxDestAmount, txOwner, txBlockNumber);
        await verifyRate(web3Service, source, dest, srcAmount, txBlockNumber, minConversionRate);
      } catch (error) {
        console.log(error);
      }

      txDispatch(setTxDebuggingCompleted());
    }

    debugTxHash();

    // eslint-disable-next-line
  }, [txHash]);

  return null;
}
