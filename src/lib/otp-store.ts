type OtpRecord = {
  code: string;
  expires_at: string;
  attempts: number;
  consumed: boolean;
  fullName?: string;
  surname?: string;
  role?: string;
};

const otpCache = new Map<string, OtpRecord>();

export function saveOtpCache(email: string, record: OtpRecord) {
  otpCache.set(email, record);
}

export function getOtpCache(email: string): OtpRecord | undefined {
  return otpCache.get(email);
}

export function markOtpCacheConsumed(email: string) {
  const record = otpCache.get(email);
  if (record) {
    record.consumed = true;
    otpCache.set(email, record);
  }
}

export function incrementOtpCacheAttempts(email: string) {
  const record = otpCache.get(email);
  if (record) {
    record.attempts += 1;
    otpCache.set(email, record);
  }
}
