import { Timestamp } from '@react-native-firebase/firestore';

export interface User {
  uid: string,
  displayName: string,
  email: string,
  photoURL: string | null,
}

export interface FirestoreMessage {
  id?: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
}

export interface FirestoreChat {
  id?: string;
  members: string[];
  messages?: FirestoreMessage[];
}
