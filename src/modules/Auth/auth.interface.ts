export interface SendOtpBody {
  phone: string;
}

export interface RegisterBody {
  phone: string;
  otp: string;
  password: string;
  name: string;
}

export interface LoginBody {
  phone: string;
  password: string;
}

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  role: string;
}
