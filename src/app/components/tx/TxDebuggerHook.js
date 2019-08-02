import { useState, useEffect } from 'react';
import Web3Service from "../../../services/Web3Service";
import * as calculators from "../../../utils/calculators";
import { ETHER_ADDRESS } from "../../../config/app";

export default function useTxDebugger(txHash) {
  const [step, setStep] = useState(1);
  const [txErrors, setTxErrors] = useState({
    gasUsed: {
      name: 'Gas Used',
      checking: true,
      error: '',
      step: 1
    },
    gasPrice: {
      name: 'Gas Price',
      checking: false,
      error: '',
      step: 2
    },
    etherValue: {
      name: 'Ether Value',
      checking: false,
      error: '',
      step: 3
    },
    allowance: {
      name: 'Allowance',
      checking: false,
      error: '',
      step: 4
    },
    balance: {
      name: 'Balance',
      checking: false,
      error: '',
      step: 5
    },
    etherAmount: {
      name: 'Ether Amount',
      checking: false,
      error: '',
      step: 6
    },
    userCap: {
      name: 'User Cap',
      checking: false,
      error: '',
      step: 7
    },
    rate: {
      name: 'Rate',
      checking: false,
      error: '',
      step: 8
    }
  });

  useEffect(() => {
    async function debugTxHash() {
      try {
        const web3Service = new Web3Service();
        const txData = await web3Service.getTx(txHash);
        const txValue = txData.value;
        const txOwner = txData.from;
        const txGasPrice = txData.gasPrice;
        const txBlockNumber = txData.blockNumber;
        const txInput = txData.input;

        const tradeData = await web3Service.exactTradeData(txInput);
        const source = tradeData[0].value;
        const srcAmount = tradeData[1].value;
        const dest = tradeData[2].value;
        const maxDestAmount = tradeData[4].value;
        const minConversionRate = tradeData[5].value;
        // const destAddress = tradeData[3].value;
        // const walletID = tradeData[6].value;

        // const reserves = await web3Service.getListReserve();
        const receipt = await web3Service.txMined(txHash);

        const transaction = {
          gasUsed: receipt.gasUsed,
          status: receipt.status,
          gas: txData.gas
        };

        setStep(txErrors.gasUsed.step);
        const gasCap = await web3Service.wrapperGetGasCap(txBlockNumber);

        if (!transaction.status || transaction.status === "0x0") {
          if (transaction.gas !== 0 && (transaction.gasUsed / transaction.gas >= 0.95)) {
            setTxErrors({
              ...txErrors,
              gasUsed: {...txErrors.gasUsed, checking: false, error: 'The TX is run out of Gas.'}
            });
          }
        }

        setStep(txErrors.gasPrice.step);
        if (calculators.compareTwoNumber(txGasPrice, gasCap) === 1) {
          setTxErrors({
            ...txErrors,
            gasPrice: {...txErrors.gasPrice, checking: false, error: 'Gas Price exceeds Gas Limit.'}
          });
        }

        if (source !== ETHER_ADDRESS) {
          setStep(txErrors.etherValue.step);
          if (calculators.compareTwoNumber(txValue, 0) === 1) {
            setTxErrors({
              ...txErrors,
              etherValue: {...txErrors.etherValue, checking: false, error: 'Sending ETH as a value while trading a token to ETH.'}
            });
          }

          setStep(txErrors.allowance.step);
          const remainStr = await web3Service.getAllowanceAtSpecificBlock(source, txOwner, txBlockNumber);

          if (calculators.compareTwoNumber(remainStr, srcAmount) === -1) {
            setTxErrors({
              ...txErrors,
              allowance: {...txErrors.allowance, checking: false, error: 'The Wallet Allowance is lower than Source Amount.'}
            });
          }

          setStep(txErrors.balance.step);
          const balance = await web3Service.getTokenBalanceAtSpecificBlock(source, txOwner, txBlockNumber);

          if (calculators.compareTwoNumber(balance, srcAmount) === -1) {
            setTxErrors({
              ...txErrors,
              balance: {...txErrors.balance, checking: false, error: 'Token Balance is lower than Source Amount.'}
            });
          }
        } else {
          setStep(txErrors.etherAmount.step);
          if (calculators.compareTwoNumber(txValue, srcAmount) !== 0) {
            setTxErrors({
              ...txErrors,
              etherAmount: {...txErrors.etherAmount, checking: false, error: 'User did not send the exact amount of ETH.'}
            });
          }
        }

        if (source === ETHER_ADDRESS) {
          setStep(txErrors.userCap.step);
          const userCap = await web3Service.getMaxCapAtSpecificBlock(txOwner, txBlockNumber);

          if (calculators.compareTwoNumber(srcAmount, userCap) === 1) {
            setTxErrors({
              ...txErrors,
              userCap: {...txErrors.userCap, checking: false, error: 'Source amount exceed User Cap.'}
            });
          }
        }

        if (dest === ETHER_ADDRESS) {
          setStep(txErrors.userCap.step);
          const userCap = await web3Service.getMaxCapAtSpecificBlock(txOwner, txBlockNumber);

          if (calculators.compareTwoNumber(maxDestAmount, userCap) === 1) {
            setTxErrors({
              ...txErrors,
              userCap: {...txErrors.userCap, checking: false, error: 'Source amount exceed User Cap.'}
            });
          }
        }

        setStep(txErrors.rate.step);
        const rates = await web3Service.getRateAtSpecificBlock(source, dest, srcAmount, txBlockNumber);

        if (calculators.compareTwoNumber(rates.expectedPrice, 0) === 0) {
          setTxErrors({
            ...txErrors,
            rate: {...txErrors.rate, checking: false, error: 'Rate is zero at execution time.'}
          });
        } else {
          if (calculators.compareTwoNumber(minConversionRate, rates.expectedPrice) === 1) {
            setTxErrors({
              ...txErrors,
              rate: {...txErrors.rate, checking: false, error: 'Min Rate is too high.'}
            });
          }
        }
      } catch (error) {
        console.log(error);
      }

      setStep(0);
    }

    debugTxHash();
  }, [txHash]);

  return [step, txErrors];
}
