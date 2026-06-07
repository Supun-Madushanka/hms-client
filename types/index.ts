export interface User {
  id: number;
  email: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
  status: string;
  token: string;
}

export interface Doctor {
  id: number;
  authId: number;
  name: string;
  email: string;
  phone: string;
  speciality: string;
  licenseNumber: string;
  experience: number;
  approvalStatus: string;
}

export interface Patient {
  id: number;
  authId: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
}

export interface Appointment {
  id: number;
  patientAuthId: number;
  doctorAuthId: number;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
  notes: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}