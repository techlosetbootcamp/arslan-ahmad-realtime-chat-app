import {useEffect, useState} from 'react';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {listenToUsers} from '../services/user';
import {useAppDispatch, useAppSelector} from '../store/store';
import {fetchUserData} from '../store/slices/user.slice';
import auth from '@react-native-firebase/auth';

const useAppNavigate = () => {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();
  const {users: usersInStore} = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser?.uid) {
        dispatch(fetchUserData(firebaseUser.uid));
      }
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user.uid && !user.photoURL) {
      dispatch(fetchUserData(user.uid));
    }
  }, [dispatch, user.uid, user.photoURL]);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    if (user?.uid && usersInStore.length === 0) {
      const unsubscribe = listenToUsers(user.uid, users => {
        dispatch({type: 'users/setAllUsers', payload: users});
      });

      return () => unsubscribe();
    }
  }, [user?.uid, usersInStore.length, dispatch]);

  return {navigation, user, isAuthChecked};
};

export default useAppNavigate;
