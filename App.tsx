import React, {useEffect, useState} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {store} from './src/store/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Navigation from './src/navigation/StackNavigation';
import {getUserFromStorage} from './src/services/authHelpers';
import {setLoading, setUser} from './src/store/slices/userSlice';
import useAuth from './src/hook/useAuth';
import Header from './src/components/Header';
import {NavigationContainer} from '@react-navigation/native';

const AppContent = () => {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const storedUser = await getUserFromStorage();
      if (storedUser) {
        dispatch(setUser(storedUser));
      }
      dispatch(setLoading(false));
      setIsLoading(false);
    };
    checkUserSession();
  }, [dispatch]);

  return (
    <>
      <NavigationContainer>
          <Navigation />
      </NavigationContainer>
    </>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
