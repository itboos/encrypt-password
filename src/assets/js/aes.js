import * as aesjs from 'aes-js'
import * as pbkdf from 'pbkdf2'

function calculateKey(pwd) {
  return pbkdf.pbkdf2Sync(pwd, 'salt', 1, 256 / 8, 'sha512');
}

export function Encrypt(pwd, str) {
  const key_256 = calculateKey(pwd);
  const textBytes = aesjs.utils.utf8.toBytes(str);

  // The counter is optional, and if omitted will begin at 1
  const aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
  const encryptedBytes = aesCtr.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  // console.log(encryptedHex);
  return encryptedHex;
}

export function Decrypt(pwd, encryptedHex) {
  const key_256 = calculateKey(pwd);
  // console.log('key_256',  key_256)
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  const aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);

  // Convert our bytes back into text
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  // console.log(decryptedText);
  return decryptedText;
}