import { ClassDTO } from '../classroom/interfaces';
import { User } from '../users/interfaces';

export interface ReadByDTO {
  user: User;
  read_at: Date;
}

export interface NotificationDTO {
  _id?: string;
  id?: string;
  title: string;
  message?: string;
  ref_url?: string;
  read_by?: ReadByDTO[];
  class?: ClassDTO;
  receivers?: User[];
  sender: User;

  created_at?: Date;
  updated_at?: Date;
}
