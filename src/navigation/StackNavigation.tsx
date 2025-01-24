import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppDispatch, useAppSelector} from '../store/store';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Profile from '../screens/Profile';
import {RootStackParamList} from '../types/navigation';
import Search from '../screens/Search';
import BottomTabsNavigator from './BottomTabsNavigator';
import {getUserFromStorage} from '../services/authHelpers';
import {setLoading, setUser} from '../store/slices/user';
import Loader from '../components/Loader';
import ChangePassword from '../screens/ChangePassword';
import ChatScreen from '../screens/Chat';
import ForgetPassword from '../screens/ForgetPassword';
import { fetchContactsThunk } from '../store/slices/contacts';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const {isLoading: userLoader, ...user} = useAppSelector(state => state.user);
  const {isLoading: chatLoader} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkUserSession = async () => {
      dispatch(setLoading(true));
      const storedUser = await getUserFromStorage();

      if (storedUser.uid) {
        dispatch(setUser(storedUser));
      }
      dispatch(setLoading(false));
    };
    checkUserSession();
  }, [dispatch]);

  useEffect(() => {
      if (user?.uid) {
        dispatch(fetchContactsThunk(user?.uid));
      }
    }, [user?.uid, dispatch]);

  if (userLoader || chatLoader) {
    return <Loader />;
  }

  return user.uid ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="MainTabs">
      <Stack.Screen name="MainTabs" component={BottomTabsNavigator} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="WelcomeScreen">
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
};

export default Navigation;
