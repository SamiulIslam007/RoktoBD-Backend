export interface SendOtpBody {
  phone: string;
}

export interface RegisterIndividualBody {
  phone: string;
  otp: string;
  email: string;
  password: string;
  name: string;
  bloodGroup: string;
  dateOfBirth: Date;
  districtId: string;
  cityId?: string;
}

export interface RegisterHospitalBody {
  phone: string;
  otp: string;
  email: string;
  password: string;
  hospitalName: string;
  contactPerson: string;
  address?: string;
  districtId?: string;
  cityId?: string;
}

export interface LoginBody {
  phone: string;
  password: string;
}
