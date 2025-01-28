import { useAppDispatch, useAppSelector } from "../store/store";
import useAuth from "./useAuth";
import { fetchMessages, listenToMessages, sendMessage } from "../services/user";
import { useEffect, useState } from "react";


const appChat = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(
    (state) => state.chat.messages[chatId] || [],
  );
  const [newMessage, setNewMessage] = useState('');
  const {user} = useAuth();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await fetchMessages(chatId);
        dispatch({type: 'chat/setMessages', payload: {chatId, messages}});
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    loadMessages();
  }, [chatId, dispatch]);

  useEffect(() => {
    const unsubscribe = listenToMessages(chatId, newMessages => {
      dispatch({
        type: 'chat/setMessages',
        payload: {chatId, messages: newMessages},
      });
    });
    return () => unsubscribe();
  }, [chatId, dispatch]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      dispatch({
        type: 'chat/addMessage',
        payload: {
          chatId,
          message: {
            id: `${Date.now()}`,
            senderId: user?.uid,
            text: newMessage,
            contentType: 'text',
            timestamp: new Date().toISOString(),
            status: {sender: 'sent', receiver: 'unread'},
          },
        },
      });
      try {
        if (user?.uid) {
          await sendMessage(participant.uid, user?.uid, newMessage);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
      setNewMessage('');
    }
  };
}

export default appChat;