export default interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
