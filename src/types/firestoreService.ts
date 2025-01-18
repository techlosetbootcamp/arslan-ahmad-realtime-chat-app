import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  status: string | null;
  chats?: string[];
  contacts?: string[];
  createdAt: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
}

export interface FirestoreMessage {
  id?: string;
  senderId: string;
  text: string;
  timestamp: FirebaseFirestoreTypes.Timestamp | null;
}

export interface FirestoreChat {
  id?: string;
  members: string[];
  messages?: FirestoreMessage[];
  createdAt: FirebaseFirestoreTypes.Timestamp | null;
}
