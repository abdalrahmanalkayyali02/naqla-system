
import { Gender } from 'src/common/enums/user-gender';

export class IUserProfile {
  id!: string;
  userId!: string;
  firstName!: string;
  lastName!: string;
  gender?: Gender | null;
  dateOfBirth?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}