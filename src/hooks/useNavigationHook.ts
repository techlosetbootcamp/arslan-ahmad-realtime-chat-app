import {useEffect, useState} from 'react';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {listenToUsers} from '../services/user';
import {observeAuthState} from '../services/auth';
import {fetchContactsThunk} from '../store/slices/contacts.slice';
import {getUserFromStorage} from '../services/async_storage';
import {useAppDispatch, useAppSelector} from '../store/store';
import {setUser} from '../store/slices/user.slice';

const appNavigate = () => {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();

  const user = useAppSelector(state => state.user);
  const {users: usersInStore} = useAppSelector(state => state.users);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userLoader, setUserLoader] = useState(false);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthState = () => {
      observeAuthState(async firebaseUser => {
        setUserLoader(true);
        if (firebaseUser) {
          if (firebaseUser.uid) {
            dispatch(setUser({...firebaseUser, uid: firebaseUser.uid!}));
          }
          if (firebaseUser.uid) {
            await dispatch(fetchContactsThunk(firebaseUser.uid));
          }
        }
        setUserLoader(false);
        setIsAuthChecked(true);
      });
    };
    checkAuthState();
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      setUserLoader(true);
      const storedUser = await getUserFromStorage();

      if (storedUser.uid) {
        dispatch(setUser(storedUser));
      }
      setIsAuthChecked(true);
    };
    checkUserSession();
    setUserLoader(false);
  }, [dispatch]);

  useEffect(() => {
    if (!user?.uid) return;

    if (user?.uid && usersInStore.length === 0) {
      const unsubscribe = listenToUsers(user.uid, users => {
        dispatch({type: 'users/setAllUsers', payload: users});
      });

      return () => unsubscribe();
    }
  }, [user?.uid, usersInStore.length, dispatch]);

  return {navigation, user, isAuthChecked, userLoader, open};
};

export default appNavigate;
