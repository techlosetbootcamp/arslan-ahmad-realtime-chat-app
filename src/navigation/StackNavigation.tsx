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
import {getUserFromStorage} from '../services/async_storage';
import {setLoading, setUser} from '../store/slices/user';
import {setLoading as setChatLoading} from '../store/slices/chats';
import LoaderScreen from '../components/LoaderScreen';
import ChangePassword from '../screens/ChangePassword';
import ChatScreen from '../screens/Chat';
import ForgetPassword from '../screens/ForgetPassword';
import {fetchUsers} from '../services/user';
import {Chat} from '../types/firestoreService';
import {setChats} from '../store/slices/chats';
import {observeAuthState} from '../services/auth';
import {fetchContactsThunk} from '../store/slices/contacts';
import { fetchChats } from '../services/chats';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const {isLoading: userLoader, ...user} = useAppSelector(state => state.user);
  const {isLoading: chatLoader} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();
  const userId = user?.uid;
  const [isAuthChecked, setAuthChecked] = useState(false);
  const {users: usersInStore} = useAppSelector(state => state.users);

  useEffect(() => {
    const fetchAllUsers = async (userId?:string) => {
      if (userId && usersInStore.length === 0) {
        const users = await fetchUsers(userId);
        dispatch({type: 'users/setAllUsers', payload: users});
      }
    };
    fetchAllUsers(userId || '');
  }, [user?.uid, usersInStore.length, dispatch]);

  useEffect(() => {
    const checkAuthState = () => {
      dispatch(setLoading(true));
      observeAuthState(async firebaseUser => {
        if (firebaseUser) {
          if (firebaseUser.uid) {
            dispatch(setUser({...firebaseUser, uid: firebaseUser.uid!}));
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

  // Fetch user from storage
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

  // Fetch chats
  useEffect(() => {
    if (userId) {
      dispatch(setChatLoading(true));
      fetchChats(userId, (chats: Chat[]) => {
        const chatMap = chats.reduce((acc, chat) => {
          acc[chat.id] = chat;
          return acc;
        }, {} as Record<string, Chat>);
        dispatch(setChats(chatMap));
        dispatch(setChatLoading(false));
      });
    }
  }, [userId, dispatch]);

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
