import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Navigation from './src/navigation/StackNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({webClientId: process.env.GOOGLE_AUTH_CLIENTID});
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
