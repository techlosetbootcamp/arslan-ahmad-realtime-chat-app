import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import BottomTabsNavigator from './BottomTabsNavigator';
import useNavigationHook from '../hooks/useNavigationHook';
import {
  ChangePasswordScreen,
  ChatScreen,
  ForgetPasswordScreen,
  ProfileScreen,
  SearchScreen,
  SignInScreen,
  SignUpScreen,
  WelcomeScreen,
} from '../constants/screens';
import Loader from '../components/loader/Loader';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const {user, isAuthChecked} = useNavigationHook();

  return isAuthChecked ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={user?.uid ? 'MainTabs' : 'WelcomeScreen'}>
      {user?.uid ? (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabsNavigator} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPasswordScreen}
          />
        </>
      )}
    </Stack.Navigator>
  ) : <Loader />;
};

export default Navigation;
