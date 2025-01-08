import { Timestamp } from '@react-native-firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
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
