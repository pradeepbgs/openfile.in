// import CryptoJS from 'crypto-js'

// export const encryptFile = async (
//     file: File,
//     keyBase64: string,
//     ivBase64: string
// ): Promise<Blob> => {
//     try {
//         const keyBuffer = Uint8Array.from(atob(keyBase64), char => char.charCodeAt(0));
//         const ivBuffer = Uint8Array.from(atob(ivBase64), char => char.charCodeAt(0));

//         const cryptoKey = await crypto.subtle.importKey(
//             "raw",
//             keyBuffer,
//             { name: "AES-CBC" },
//             false,
//             ["encrypt"]
//         );

//         const fileBuffer = await file.arrayBuffer();

//         const encryptedBuffer = await crypto.subtle.encrypt(
//             { name: "AES-CBC", iv: ivBuffer },
//             cryptoKey,
//             fileBuffer
//         );

//         return new File([encryptedBuffer], file.name, { type: file.type });

//     } catch (error) {
//         console.error("Error encrypting file:", error);
//         throw error;
//     }
// };


// export const ecn = (file: File, base64Key: string, base64Iv: string): Promise<Blob> => {
//     return new Promise((resolve, reject) => {
//         try {
//             const reader = new FileReader();
//             reader.onload = async (e) => {
//                 try {
//                     const key = CryptoJS.enc.Base64.parse(base64Key);
//                     const iv = CryptoJS.enc.Base64.parse(base64Iv);
//                     const arrayBuffer = e.target?.result as ArrayBuffer;
//                     // Convert ArrayBuffer to WordArray (CryptoJS format)
//                     const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

//                     const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
//                         iv,
//                         mode: CryptoJS.mode.CBC,
//                         padding: CryptoJS.pad.Pkcs7,
//                     }).toString();

//                     const encryptedBlob = new Blob([encrypted], { type: 'application/octet-stream' });
//                     resolve(encryptedBlob);
//                 } catch (innerError) {
//                     console.error("Error during encryption process:", innerError);
//                     reject(innerError);
//                 }
//             };

//             reader.onerror = (error) => {
//                 console.error("FileReader error:", error);
//                 reject(error);
//             };

//             reader.readAsArrayBuffer(file);

//         } catch (outerError) {
//             console.error("Error setting up FileReader:", outerError);
//             reject(outerError);
//         }

//     });
// };