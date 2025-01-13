import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation/StackNavigation';
import { getUserFromStorage } from './src/services/authHelpers';
import { setLoading, setUser } from './src/store/slices/userSlice';
import useAuth from './src/hook/useAuth';
import Header from './src/components/Header';
import SplashScreen from 'react-native-splash-screen';

const AppContent = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const storedUser = await getUserFromStorage();
      if (storedUser) {
        dispatch(setUser(storedUser));
      }
      dispatch(setLoading(false));
      setIsLoading(false);  // Indicate that loading is complete
      SplashScreen.hide();  // Hide splash screen when the app is ready
    };
    checkUserSession();
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        // You can add a custom loader here if needed.
        null
      ) : (
        user?.email && user.uid ? <Header><Navigation /></Header> : <Navigation />
      )}
    </>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
