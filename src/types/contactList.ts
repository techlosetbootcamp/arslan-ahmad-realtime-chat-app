import { User } from './firestoreService';

export type ContactsProps = {
  sections: {title: string; data: User[]}[];
}
