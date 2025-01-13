import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation/StackNavigation';
import { getUserFromStorage } from './src/services/authHelpers';
import { setLoading, setUser } from './src/store/slices/userSlice';
import useAuth from './src/hook/useAuth';
import Header from './src/components/Header';

const AppContent = () => {
  const dispatch = useDispatch();
  const {user} = useAuth();

  useEffect(() => {
    const checkUserSession = async () => {
      const storedUser = await getUserFromStorage();
      if (storedUser) {
        dispatch(setUser(storedUser));
      }
      dispatch(setLoading(false));
    };
    checkUserSession();
  }, [dispatch]);

  return user?.email && user.uid ? <Header><Navigation /></Header> : <Navigation />;
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
