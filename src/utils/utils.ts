export const getOtpCode = () =>
  (Math.floor(Math.random() * 999999) + "").slice(0, 4);

export const SAFE_USER_SELECT =
  "-password -otpCode -otpExpiry -passwordResetId -passwordResetExpiry";
