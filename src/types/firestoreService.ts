import {
  FirebaseFirestoreTypes,
  Timestamp,
} from '@react-native-firebase/firestore';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  status?: string | null;
  createdAt: FirebaseFirestoreTypes.FieldValue | Timestamp | null;
}

export interface FirestoreMessage {
  id?: string;
  senderId: string;
  text: string;
  timestamp: FirebaseFirestoreTypes.FieldValue | Timestamp | null;
}

export interface FirestoreChat {
  id?: string;
  members: string[];
  messages?: FirestoreMessage[];
  createdAt?: FirebaseFirestoreTypes.FieldValue | Timestamp | null;
}
