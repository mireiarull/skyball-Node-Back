export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends Credentials {
  name: string;
  gender: string;
  level: string;
}
