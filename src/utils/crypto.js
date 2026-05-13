import CryptoJS from 'crypto-js';

const SECRET_KEY = 'movapp';

export const decryptData = (cipherText) => {
   const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
   const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
   return JSON.parse(decryptedText);
};

export const encryptData = (data) => {
   const stringData = typeof data === 'string' ? data : JSON.stringify(data);
   return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
};
