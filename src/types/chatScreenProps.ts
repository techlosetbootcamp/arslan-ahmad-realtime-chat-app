export type ChatScreenProps = {
  name: string;
  params: {
    chatId: string;
    participant: {
      uid: string;
      displayName: string;
      photoURL: string;
      status: string;
    };
  };
};
