export type RootStackParamList = {
  Home: undefined;
  Contacts: undefined;
  WelcomeScreen: undefined;
  SignIn: undefined;
  Chat: {
    contact: {
      chatId: string;
      name: string;
      avatar: string;
    };
  };
  Profile: {userId: string; username: string};
};
