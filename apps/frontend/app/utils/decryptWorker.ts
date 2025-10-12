import { base64UrlToBase64 } from "./encrypt-decrypt";

  self.onmessage = async (e) => {
    const { base64Key, base64IV, encryptedData } = e.data;
  
    try {
      const keyBytes = Uint8Array.from(atob(base64UrlToBase64(base64Key)), c => c.charCodeAt(0));
      const ivBytes = Uint8Array.from(atob(base64UrlToBase64(base64IV)), c => c.charCodeAt(0));
  
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
      );
  
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: ivBytes },
        cryptoKey,
        encryptedData
      );
  
      self.postMessage({ decryptedBuffer });
    } catch (error) {
      self.postMessage({ error: error?.message || "Unknown decryption error" });
    }
  };
  