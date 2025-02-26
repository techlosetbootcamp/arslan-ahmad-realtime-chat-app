import HomeScreen from '../screens/home/Home';
import ProfileScreen from '../screens/profile/Profile';
import ChatScreen from '../screens/chat/Chat';
import SettingsScreen from '../screens/settings/Settings';
import SignInScreen from '../screens/authScreens/signin/SignIn';
import SignUpScreen from '../screens/authScreens/signup/SignUp';
import ContactsScreen from '../screens/contacts/Contacts';
import ForgetPasswordScreen from '../screens/forgetPassword/ForgetPassword';
import WelcomeScreen from '../screens/welcomescreen/WelcomeScreen';
import ChangePasswordScreen from '../screens/changePassword/ChangePassword';
import SearchScreen from '../screens/search/Search';

export {
  HomeScreen,
  ProfileScreen,
  ChatScreen,
  SettingsScreen,
  SignInScreen,
  SignUpScreen,
  ContactsScreen,
  ForgetPasswordScreen,
  WelcomeScreen,
  ChangePasswordScreen,
  SearchScreen,
};

export const STACK_AUTH_SCREENS = [
  {name: 'WelcomeScreen', component: WelcomeScreen},
  {name: 'SignUp', component: SignUpScreen},
  {name: 'SignIn', component: SignInScreen},
  {name: 'ForgetPassword', component: ForgetPasswordScreen},
];

export const STACK_MAIN_SCREENS = [
  {name: 'MainTabs', component: HomeScreen},
  {name: 'Chat', component: ChatScreen},
  {name: 'Search', component: SearchScreen},
  {name: 'Profile', component: ProfileScreen},
  {name: 'ChangePassword', component: ChangePasswordScreen},
];
