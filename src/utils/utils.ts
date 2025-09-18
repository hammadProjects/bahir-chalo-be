export const getOtpCode = () =>
  (Math.floor(Math.random() * 999999) + "").slice(0, 4);

export const SAFE_USER_SELECT =
  "-password -otpCode -otpExpiry -passwordResetId -passwordResetExpiry";

export const PLANS = {
  basic: {
    credits: 2,
    price: 0,
  },
  standard: {
    credits: 12,
    price: 100,
  },
  premium: {
    credits: 24,
    price: 100,
  },
};
