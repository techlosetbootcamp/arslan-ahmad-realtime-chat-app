import {useEffect, useState} from 'react';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {fetchUsers} from '../services/user';
import {Chat} from '../types/firestoreService';
import {setChats} from '../store/slices/chats.slice';
import {observeAuthState} from '../services/auth';
import {fetchContactsThunk} from '../store/slices/contacts.slice';
import {fetchChats} from '../services/chats';
import {getUserFromStorage} from '../services/async_storage';
import {useAppDispatch, useAppSelector} from '../store/store';
import {setUser} from '../store/slices/user';

const appNavigate = () => {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();

  const user = useAppSelector(state => state.user);
  const {users: usersInStore} = useAppSelector(state => state.users);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userLoader, setUserLoader] = useState(false);
  const [chatLoader, setChatLoader] = useState(false);
  const dispatch = useAppDispatch();

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
    if (user.uid) {
      setChatLoader(true);
      fetchChats(user.uid, (chats: Chat[]) => {
        const chatMap = chats.reduce((acc, chat) => {
          acc[chat.id] = chat;
          return acc;
        }, {} as Record<string, Chat>);
        dispatch(setChats(chatMap));
        setChatLoader(false);
      });
    }
  }, [user.uid, dispatch]);

  useEffect(() => {
    const fetchAllUsers = async (userId?: string) => {
      if (userId && usersInStore.length === 0) {
        const users = await fetchUsers(userId);
        dispatch({type: 'users/setAllUsers', payload: users});
      }
    };
    fetchAllUsers(user.uid || '');
  }, [user?.uid, usersInStore.length, dispatch]);

  return {navigation, user, isAuthChecked, userLoader, chatLoader};
};

export default appNavigate;
