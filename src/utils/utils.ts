export const getOtpCode = () =>
  (Math.floor(Math.random() * 999999) + "").slice(0, 4);
