import {useEffect, useState} from 'react';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {listenToUsers} from '../services/user';
import auth from '@react-native-firebase/auth';
import {useAppDispatch, useAppSelector} from '../store/store';
import {UserState} from '../store/slices/user.slice';

const useNavigationHook = () => {
  const navigation =
  useNavigation<BottomTabNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<UserState>({} as UserState);
  const {users: usersInStore} = useAppSelector(state => state.users);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  // const [userLoader, setUserLoader] = useState(false);
  const dispatch = useAppDispatch();


  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
      const userData: UserState = {
        uid: firebaseUser?.uid || '',
        displayName: firebaseUser?.displayName || null,
        email: firebaseUser?.email || null,
        photoURL: firebaseUser?.photoURL || null,
        description: '',
        status: null,
        contacts: [],
        chats: [],
        isLoading: false,
      };
      setUser(userData);
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    if (user.uid && usersInStore.length === 0) {
      const unsubscribe = listenToUsers(user.uid, users => {
        dispatch({type: 'users/setAllUsers', payload: users});
      });

      return () => unsubscribe();
    }
  }, [user?.uid, usersInStore.length, dispatch]);

  return {navigation, user, isAuthChecked};
};

export default useNavigationHook;
