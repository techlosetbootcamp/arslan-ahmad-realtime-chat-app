import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import useNavigationHook from '../hooks/useNavigationHook';
import {STACK_AUTH_SCREENS, STACK_MAIN_SCREENS} from '../constants/screens';
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
          {STACK_MAIN_SCREENS?.map(screen => {
            return (
              <Stack.Screen
                key={screen.name}
                name={screen.name as keyof RootStackParamList}
                component={screen.component}
              />
            );
          })}
        </>
      ) : (
        <>
          {STACK_AUTH_SCREENS?.map(screen => {
            return (
              <Stack.Screen
                key={screen.name}
                name={screen.name as keyof RootStackParamList}
                component={screen.component}
              />
            );
          })}
        </>
      )}
    </Stack.Navigator>
  ) : (
    <Loader />
  );
};

export default Navigation;
