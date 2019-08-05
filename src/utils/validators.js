export function validateTxHash(txHash) {
  return txHash.match(/^0x([A-Fa-f0-9]{64})$/);
}
