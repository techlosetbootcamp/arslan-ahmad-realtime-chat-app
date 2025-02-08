import { useEffect, useState } from 'react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { listenToUsers } from '../services/user';
import { observeAuthState } from '../services/auth';
import { fetchContactsThunk } from '../store/slices/contacts.slice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setUser, UserState } from '../store/slices/user.slice';

const useNavigationHook = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootStackParamList>>();
  const user = useAppSelector(state => state.user);
  const { users: usersInStore } = useAppSelector(state => state.users);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userLoader, setUserLoader] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = observeAuthState(async firebaseUser => {
      setUserLoader(true);
      if (firebaseUser) {
        if (firebaseUser.uid) {
          dispatch(setUser({ ...firebaseUser, uid: firebaseUser.uid })); // Ensure uid is a string
        }
        if (firebaseUser.uid) {
          await dispatch(fetchContactsThunk(firebaseUser.uid));
        }
      } else {
        dispatch(setUser({ uid: '' } as Partial<UserState> & { uid: string })); // Clear user state if not authenticated
      }
      setUserLoader(false);
      setIsAuthChecked(true);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, [dispatch]);

  useEffect(() => {
    if (!user?.uid) return; // Check if uid is null

    if (user.uid && usersInStore.length === 0) {
      const unsubscribe = listenToUsers(user.uid, users => {
        dispatch({ type: 'users/setAllUsers', payload: users });
      });

      return () => unsubscribe();
    }
  }, [user?.uid, usersInStore.length, dispatch]);

  return { navigation, user, isAuthChecked, userLoader };
};

export default useNavigationHook;