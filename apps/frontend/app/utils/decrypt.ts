// import CryptoJS from "crypto-js";
// export const decryptAndDownloadFile= async (fileurl: string, filename: string, key:string, iv:string) => {
//     try {
//         // setShowMessage('decoding key and iv...')
//         const safeKey = CryptoJS.enc.Base64.parse(key)
//         const safeIv = CryptoJS.enc.Base64.parse(iv)
//         const keyBytes = Uint8Array.from(atob(safeKey), c => c.charCodeAt(0));
//         const ivBytes = Uint8Array.from(atob(safeIv), c => c.charCodeAt(0));

//         const awskey = new URL(fileurl).pathname.slice(1);
//         // setShowMessage('Downloading file...')
//         const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file/signed-url?key=${awskey}`);
//         const data = await res.json();
//         const fileRes = await fetch(data.url)
//         const encryptedBuffer = await fileRes.arrayBuffer()

//         const cryptoKey = await crypto.subtle.importKey(
//             'raw',
//             keyBytes,
//             { name: 'AES-CBC' },
//             false,
//             ['decrypt']
//         );
//         // setShowMessage("Decrypting file...")
//         const decrypedBuffer = await crypto.subtle.decrypt(
//             { name: 'AES-CBC', iv: ivBytes },
//             cryptoKey,
//             encryptedBuffer
//         )

//         const blob = new Blob([decrypedBuffer])
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = filename;
//         a.click();
//         URL.revokeObjectURL(url);
//     } catch (error) {
//         console.error('encryption failed', error);
//     } finally {
//         // setShowMessage('Decrypt & Download')
//     }
// }