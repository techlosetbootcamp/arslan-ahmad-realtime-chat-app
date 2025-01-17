import React, {useEffect, useState} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {store} from './src/store/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Navigation from './src/navigation/StackNavigation';
import {getUserFromStorage} from './src/services/authHelpers';
import {setLoading, setUser} from './src/store/slices/userSlice';
import useAuth from './src/hooks/useAuth';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabsNavigator from './src/navigation/BottomTabsNavigator';

const AppContent = () => {
  const dispatch = useDispatch();
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
      <Navigation />
    </>
  );
};

const App = () => {
  const {user} = useAuth();
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <NavigationContainer>
          {user ? <AppContent /> : <BottomTabsNavigator />}
          {/* <AppContent />  */}
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
