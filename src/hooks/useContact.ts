import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchContactsThunk} from '../store/slices/contactsSlice';
import {User} from '../types/firestoreService';
import useAuth from './useAuth';
import {AppDispatch, RootState} from '../store/store';

const useContacts = () => {
  const [sections, setSections] = useState<{title: string; data: User[]}[]>([]);
  const {user} = useAuth();
  const dispatch: AppDispatch = useDispatch();

  const {contacts, loading, error} = useSelector(
    (state: RootState) => state.contacts,
  );


  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchContactsThunk(user?.uid));
    }
  }, [user?.uid, dispatch]);

  useEffect(() => {
    if (contacts.length > 0) {
      setSections(groupContactsByAlphabet(contacts));
    }
  }, [contacts]);

  return {contacts, sections, loading, error};
};

const groupContactsByAlphabet = (contacts: User[]) => {
  const grouped: {[key: string]: User[]} = {};

  contacts.forEach(contact => {
    const firstLetter = contact.displayName
      ? contact?.displayName[0].toUpperCase()
      : '';
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(contact);
  });

  return Object.keys(grouped)
    .sort()
    .map(letter => ({
      title: letter,
      data: grouped[letter],
    }));
};

export default useContacts;
