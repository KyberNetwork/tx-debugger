import BigNumber from 'bignumber.js';

export function maskNumber() {
  const initNumber = new BigNumber(2);
  return "0x" + (initNumber.pow(255).toString(16));
}

export function sumOfTwoNumber(firstNumber, secondNumber) {
  const firstNumberBig = new BigNumber(firstNumber.toString());
  const secondNumberBig = new BigNumber(secondNumber.toString());
  const sum = firstNumberBig.plus(secondNumberBig);
  return sum.toString();
}

export function toHex(number) {
  const numberBig = new BigNumber(number);
  return "0x" + numberBig.toString(16);
}

export function compareTwoNumber(firstNumber, secondNumber) {
  const firstNumberBig = new BigNumber(firstNumber.toString());
  const secondNumberBig = new BigNumber(secondNumber.toString());
  return firstNumberBig.comparedTo(secondNumberBig);
}
