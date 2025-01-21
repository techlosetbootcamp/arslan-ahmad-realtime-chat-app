import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Navigation from './src/navigation/StackNavigation';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
