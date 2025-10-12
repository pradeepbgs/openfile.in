// import CryptoJS from "crypto-js";

// export const generate_KeyAndIV = () => {
//     const key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
//     const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
//     return { key, iv };
// };

// export const encryptFile1 = async (file: File, keyHex: string, ivHex: string) => {
//     const fileData = await file.arrayBuffer();
//     const wordArray = CryptoJS.lib.WordArray.create(fileData);

//     const encrypted = CryptoJS.AES.encrypt(wordArray, CryptoJS.enc.Hex.parse(keyHex), {
//         iv: CryptoJS.enc.Hex.parse(ivHex),
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//     });

//     const base64 = encrypted.toString();
//     const blob = new Blob([base64], { type: "text/plain" });
//     return blob;
// };

// export const decryptToFile = (base64CipherText:string, keyHex:string, ivHex:string) => {
//     const decrypted = CryptoJS.AES.decrypt(base64CipherText, CryptoJS.enc.Hex.parse(keyHex), {
//         iv: CryptoJS.enc.Hex.parse(ivHex),
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//     });

//     const decryptedBytes = decrypted.sigBytes;
//     const decryptedArrayBuffer = new Uint8Array(decryptedBytes);

//     for (let i = 0; i < decryptedBytes; i++) {
//         decryptedArrayBuffer[i] = decrypted.words[i >>> 2] >>> (24 - (i % 4) * 8) & 0xff;
//     }

//     return new Blob([decryptedArrayBuffer]);
// };


// /**
//  * Fetch the file, decrypt it, and trigger download
//  */
// export const decryptAndDownloadFile1 = async (
//     fileUrl: string,
//     fileName: string,
//     iv: string,
//     key: string
// ) => {
//     try {
//         const awskey = new URL(fileUrl).pathname.slice(1);
//         const download_url = await fetch(
//             `${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file/signed-url?key=${awskey}`,
//             {
//                 credentials:'include'
//             }
//         );
//         const data = await download_url.json();
//         const res = await fetch(data.url);
//         const encryptedText = await res.text();

//         const decryptedBlob = await decryptToFile(encryptedText, key, iv);

//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(decryptedBlob);
//         link.download = fileName;
//         link.click();
//     } catch (error) {
//         console.error("Error during decryption/download:", error);
//     }
// };




// /**
//  * Encrypt a file using AES-CBC with Base64 key and IV.
//  */
// export const encryptFile2 = (file: File, base64Key: string, base64Iv: string): Promise<Blob> => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();

//         reader.onload = () => {
//             try {
//                 const arrayBuffer = reader.result as ArrayBuffer;
//                 const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
//                 const key = CryptoJS.enc.Base64.parse(base64Key);
//                 const iv = CryptoJS.enc.Base64.parse(base64Iv);

//                 const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
//                     iv,
//                     mode: CryptoJS.mode.CBC,
//                     padding: CryptoJS.pad.Pkcs7,
//                 }).toString(); // Base64 encoded

//                 const encryptedBlob = new Blob([encrypted], { type: "text/plain" });
//                 resolve(encryptedBlob);
//             } catch (err) {
//                 reject(err);
//             }
//         };

//         reader.onerror = reject;
//         reader.readAsArrayBuffer(file);
//     });
// };



// /**
//  * Download, decrypt, and trigger download of a file using Base64 key/IV
//  */
// export const decryptAndDownloadFile2 = async (
//     fileUrl: string,
//     filename: string,
//     base64Iv: string,
//     base64Key: string
// ) => {
//     try {
//         const awsKey = new URL(fileUrl).pathname.slice(1);

//         const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file/signed-url?key=${awsKey}`);
//         const { url } = await res.json();

//         const encryptedTextRes = await fetch(url);
//         const encryptedBase64 = await encryptedTextRes.text();

//         const key = CryptoJS.enc.Base64.parse(base64Key);
//         const iv = CryptoJS.enc.Base64.parse(base64Iv);

//         const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
//             iv,
//             mode: CryptoJS.mode.CBC,
//             padding: CryptoJS.pad.Pkcs7,
//         });

//         const decryptedWords = decrypted.words;
//         const sigBytes = decrypted.sigBytes;
//         const uint8Array = new Uint8Array(sigBytes);

//         for (let i = 0; i < sigBytes; i++) {
//             uint8Array[i] = (decryptedWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
//         }

//         const blob = new Blob([uint8Array]);
//         const blobUrl = URL.createObjectURL(blob);

//         const a = document.createElement("a");
//         a.href = blobUrl;
//         a.download = filename;
//         a.click();
//         URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//         console.error("Decryption failed:", error);
//     }
// };
