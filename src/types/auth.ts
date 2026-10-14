export type AuthErrorCode =
  | "configuration"
  | "invalidInput"
  | "invalidCredentials"
  | "emailNotConfirmed"
  | "emailNotAuthorized"
  | "invalidEmail"
  | "weakPassword"
  | "signupDisabled"
  | "emailSendLimited"
  | "serviceUnavailable"
  | "passwordMismatch"
  | "loginFailed"
  | "signupFailed"
  | "rateLimited";

export type AuthActionState = {
  error?: AuthErrorCode;
  reference?: string;
  success?: "checkEmail";
};
