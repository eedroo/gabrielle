import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const KEY_LENGTH = 64;

export const MIN_PASSWORD_LENGTH = 10;

/** "scrypt$<salt b64>$<hash b64>" */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

/** Readable temporary password for a new account, e.g. "velvet-cedar-4821". */
export function temporaryPassword(): string {
  const words = ["amber", "velvet", "silk", "rose", "ivory", "pearl", "opal", "jasmine", "linen", "cedar", "golden", "satin"];
  const pick = () => words[randomBytes(1)[0] % words.length];
  return `${pick()}-${pick()}-${1000 + (randomBytes(2).readUInt16BE() % 9000)}`;
}
