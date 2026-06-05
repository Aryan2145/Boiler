export type Contractor = {
  id: string;
  fullName: string;
  licenseNo: string;
  companyName: string;
  companyAddress: string;
  telephone: string;
  email: string;
  createdAt: string;
};

export type GovtRole =
  | "ADMIN"
  | "DIRECTOR"
  | "DEPUTY_DIRECTOR"
  | "ASSISTANT_DIRECTOR";

export type GovtUser = {
  id: string;
  name: string;
  role: GovtRole;
  phone: string;
  email: string;
  zone: string;
  createdAt: string;
};

export type Session =
  | { type: "contractor"; user: Contractor }
  | { type: "govt"; user: GovtUser };

export type AuthResponse = Session & { accessToken: string };

export const GOVT_ROLE_LABELS: Record<GovtRole, string> = {
  ADMIN: "Administrator",
  DIRECTOR: "Director",
  DEPUTY_DIRECTOR: "Deputy Director",
  ASSISTANT_DIRECTOR: "Assistant Director",
};
