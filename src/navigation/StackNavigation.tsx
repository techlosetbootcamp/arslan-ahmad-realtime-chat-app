import React, {useEffect, useState} from 'react';
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
import LoaderScreen from '../components/LoaderScreen';
import ChangePassword from '../screens/ChangePassword';
import ChatScreen from '../screens/Chat';
import ForgetPassword from '../screens/ForgetPassword';
import {fetchContactsThunk} from '../store/slices/contacts';
import { observeAuthState } from '../services/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const {isLoading: userLoader, ...user} = useAppSelector(state => state.user);
  const {isLoading: chatLoader, chats} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();
  const userId = user?.uid;
  const [isAuthChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuthState = () => {
      dispatch(setLoading(true));
      observeAuthState(async firebaseUser => {
        if (firebaseUser) {
          if (firebaseUser.uid) {
            dispatch(setUser({ ...firebaseUser, uid: firebaseUser.uid! }));
          }
          if (firebaseUser.uid) {
            await dispatch(fetchContactsThunk(firebaseUser.uid));
          }
        }
        dispatch(setLoading(false));
        setAuthChecked(true);
      });
    };
    checkAuthState();
  }, [dispatch]);

  useEffect(() => {
    const checkUserSession = async () => {
      dispatch(setLoading(true));
      const storedUser = await getUserFromStorage();

      if (storedUser.uid) {
        dispatch(setUser({ ...storedUser, uid: storedUser.uid! }));
      }
      dispatch(setLoading(false));
    };
    checkUserSession();
  }, [dispatch]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchContactsThunk(user?.uid));
    }
    console.log('user (StackNavigation.tsx) =>', user);
  }, [user?.uid, dispatch]);

  if (!isAuthChecked || userLoader || chatLoader) {
    return <LoaderScreen />;
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
