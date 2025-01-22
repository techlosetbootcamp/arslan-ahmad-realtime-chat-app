import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import useAuth from "./useAuth";
import { fetchMessages, listenToMessages, sendMessage } from "../services/firebase";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";


const appChat = () => {
  const dispatch = useDispatch();
  const messages = useSelector(
    (state: RootState) => state.chat.messages[chatId] || [],
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