import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Profile from '../screens/Profile';
import {RootStackParamList} from '../types/navigation';
import Search from '../screens/Search';
import BottomTabsNavigator from './BottomTabsNavigator';
import {getUserFromStorage} from '../services/authHelpers';
import {setLoading, setUser} from '../store/slices/userSlice';
import Loader from '../components/Loader';
import ForgetPassword from '../screens/ForgetPassword';
import ChatScreen from '../screens/Chat';
import ChatHeader from '../components/ChatHeader';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const {isLoading: loading, ...user} = useSelector(
    (state: RootState) => state.user,
  );

  console.log('User:(stackNavigation)', user.uid);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserSession = async () => {
      const storedUser = await getUserFromStorage();

      if (storedUser.uid) {
        dispatch(setUser(storedUser));
      }
      dispatch(setLoading(false));
    };
    checkUserSession();
  }, [dispatch]);

  if (loading) {
    <Loader />;
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
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
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
    </Stack.Navigator>
  );
};

export default Navigation;
