export interface SendOtpBody {
  phone: string;
}

export interface VerifyOtpBody {
  phone: string;
  otp: string;
}

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  role: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  user: AuthUser;
}
