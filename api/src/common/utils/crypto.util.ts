import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

/**
 * Cryptography utility functions
 */
export class CryptoUtil {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string, saltRounds = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare a password with a hash using bcrypt
   */
  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a random token
   */
  static generateToken(length = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Create a SHA-256 hash of a string
   */
  static createHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Encrypt data using AES-256-CBC
   */
  static encrypt(
    text: string,
    secretKey: string,
  ): { iv: string; encryptedData: string } {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
    };
  }

  /**
   * Decrypt data using AES-256-CBC
   */
  static decrypt(
    encryptedData: string,
    iv: string,
    secretKey: string,
  ): string {
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      key,
      Buffer.from(iv, 'hex'),
    );
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Generate a secure URL-friendly UUID
   */
  static generateUuid(): string {
    return crypto.randomUUID();
  }
}
