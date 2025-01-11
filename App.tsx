import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation/StackNavigation';
import { getUserFromStorage } from './src/services/authHelpers';
import { setLoading, setUser } from './src/store/slices/userSlice';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserSession = async () => {
      const storedUser = await getUserFromStorage();
      if (storedUser) {
        dispatch(setUser(storedUser)); // Use your custom User type here
      }
      dispatch(setLoading(false));
    };

    checkUserSession();
  }, [dispatch]);

  return <Navigation />;
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
