const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

// ✅ Hash Function (Used for Checking Uniqueness)
const hashEmail = (email) => {
  return crypto.createHash("sha256").update(email).digest("hex");
};

// ✅ Encrypt Function (For Storing Securely)
const encrypt = (text) => {
  try {
    if (!text) return text;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("❌ Encryption Error:", error);
    return "[ENCRYPTION ERROR]";
  }
};

// ✅ Decrypt Function (For Retrieving Data)
const decrypt = (text) => {
  try {
    if (!text) return text;
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (error) {
    console.error("❌ Decryption Error:", error);
    return "[DECRYPTION FAILED]";
  }
};

module.exports = { hashEmail, encrypt, decrypt };
