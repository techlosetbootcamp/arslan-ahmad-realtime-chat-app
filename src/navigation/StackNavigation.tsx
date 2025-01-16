import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Contacts from '../screens/Contacts';
import Chat from '../screens/Chat';
import Header from '../components/Header';  
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const { isLoading: loading, ...user } = useSelector(
    (state: RootState) => state.user,
  );

  if (loading) {
    return null;
  }

  return (
      <Stack.Navigator
        screenOptions={{
          header: () => <Header />, 
        }}
        initialRouteName={user.uid && user.email ? 'Home' : 'WelcomeScreen'}>
        {user.uid && user.email ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Contacts" component={Contacts} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
  );
};

export default Navigation;
