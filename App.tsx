import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './src/types/navigation';
import firebase from '@react-native-firebase/app';
import Chat from './src/screens/Chat';
import Home from './src/screens/Home';
import SignInScreen from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import WelcomeScreen from './src/screens/WelcomeScreen';
import Profile from './src/screens/Profile';
import Contacts from './src/screens/Contacts';
import Header from './src/components/Header';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import useAuth from './src/hook/useAuth';
import {Provider} from 'react-redux';
import {store} from './src/store/store';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {

  useEffect(() => {
    try {
      if (firebase.apps.length) {
        console.log('Firebase is connected! ✅');
        console.log('Firebase apps:', firebase.apps.length);
        console.log('Current config:', firebase.app().options);
      } else {
        console.log('Firebase is not connected! ❌');
      }
    } catch (error) {
      console.error('Firebase verification failed:', error);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            //  screenOptions={{headerShown: false}}
            screenOptions={({route}) => ({
              header: () => <Header title={route.name} />,
            })}
            initialRouteName="WelcomeScreen">
            <Stack.Screen
              name="WelcomeScreen"
              options={{headerShown: false}}
              component={WelcomeScreen}
            />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
              name="SignIn"
              options={{
                headerShown: false,
              }}
              component={SignInScreen}
            />
            <Stack.Screen
              name="SignUp"
              options={{
                headerShown: false,
              }}
              component={SignUp}
            />
            <Stack.Screen name="Contacts" component={Contacts} />
            <Stack.Screen
              name="Profile"
              component={Profile}
            />
            <Stack.Screen name="Chat" component={Chat} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
