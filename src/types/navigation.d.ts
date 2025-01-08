export type RootStackParamList = {
  Home: undefined;
  Contacts: undefined;
  Chat: {
    contact: {
      chatId: string;
      name: string;
      avatar: string;
    };
  };
  Profile: {userId: string; username: string};
};
