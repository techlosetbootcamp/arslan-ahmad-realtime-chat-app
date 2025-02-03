import {useEffect} from 'react';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {fetchUsers} from '../services/user';
import {Chat} from '../types/firestoreService';
import {setChats} from '../store/slices/chats';
import {observeAuthState} from '../services/auth';
import {fetchContactsThunk} from '../store/slices/contacts';
import {fetchChats} from '../services/chats';
import {getUserFromStorage} from '../services/async_storage';
import {setLoading, setUser} from '../store/slices/user';
import {setLoading as setChatLoading} from '../store/slices/chats';
import {useAppDispatch, useAppSelector} from '../store/store';

const appNavigate = () => {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();

  const user = useAppSelector(state => state.user);
  const {isLoading: userLoader} = useAppSelector(state => state.user);
  const {isLoading: chatLoader} = useAppSelector(state => state.chat);
  const {users: usersInStore} = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuthState = () => {
      dispatch(setLoading(true));
      observeAuthState(async firebaseUser => {
        if (firebaseUser) {
          if (firebaseUser.uid) {
            dispatch(setUser({...firebaseUser, uid: firebaseUser.uid!}));
          }
          if (firebaseUser.uid) {
            await dispatch(fetchContactsThunk(firebaseUser.uid));
          }
        }
        dispatch(setLoading(false));
      });
    };
    checkAuthState();
  }, [dispatch]);

  useEffect(() => {
    const checkUserSession = async () => {
      dispatch(setLoading(true));
      const storedUser = await getUserFromStorage();

      if (storedUser.uid) {
        dispatch(setUser(storedUser));
      }
      dispatch(setLoading(false));
    };
    checkUserSession();
  }, [dispatch]);

  useEffect(() => {
    if (user.uid) {
      dispatch(setChatLoading(true));
      fetchChats(user.uid, (chats: Chat[]) => {
        const chatMap = chats.reduce((acc, chat) => {
          acc[chat.id] = chat;
          return acc;
        }, {} as Record<string, Chat>);
        dispatch(setChats(chatMap));
      });
      dispatch(setChatLoading(false));
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

  return {navigation, userLoader, chatLoader, user};
};

export default appNavigate;
