interface OtpEntry {
  code: string;
  expiresAt: number;
}

const otpMap = new Map<string, OtpEntry>();

export function setOtp(email: string, code: string, expiresAt: number) {
  otpMap.set(email, { code, expiresAt });
}

export function getOtp(email: string) {
  return otpMap.get(email);
}

export function deleteOtp(email: string) {
  otpMap.delete(email);
}

export function hasOtp(email: string) {
  return otpMap.has(email);
}
