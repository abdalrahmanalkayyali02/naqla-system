
import { UserStatus } from 'src/common/enums/user-status';

export interface IUser {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  phoneDialCode: string | null;
  isVerifiedUser: boolean;
  userStatus: UserStatus;
}