import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {fetchChats} from '../../services/chats';
import {Chat} from '../../types/firestoreService';
import {setChats} from '../../store/slices/chats.slice';

const useHome = () => {
  const [chatLoader, setChatLoader] = useState(false);
  const {chats} = useAppSelector(state => state.chat);
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.uid) {
      setChatLoader(true);
      fetchChats(user.uid, (chats: Chat[]) => {
        const chatMap = chats.reduce((acc, chat) => {
          acc[chat.id] = chat;
          return acc;
        }, {} as Record<string, Chat>);
        console.log('chatMap => From DB(useHome.ts)', chatMap)
        dispatch(setChats(chatMap));
      });
      setChatLoader(false);
    }
  }, [user.uid, dispatch]);

  return {chats, chatLoader};
};

export default useHome;
