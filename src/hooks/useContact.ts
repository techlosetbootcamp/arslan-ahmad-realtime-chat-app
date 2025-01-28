import {useEffect, useState} from 'react';
import {User} from '../types/firestoreService';
import useAuth from './useAuth';
import {useAppDispatch, useAppSelector} from '../store/store';
import {fetchContactsThunk, setContactsLoading} from '../store/slices/contacts';

const useContacts = () => {
  const [sections, setSections] = useState<{title: string; data: User[]}[]>([]);
  const {user} = useAuth();
  const dispatch = useAppDispatch();

  const {contacts, error} = useAppSelector(state => state.contacts);

  useEffect(() => {
    if (user?.uid) {
      setContactsLoading(true);
      dispatch(fetchContactsThunk(user?.uid));
      setContactsLoading(false);
    }
  }, [user?.uid, dispatch]);

  useEffect(() => {
    if (contacts.length > 0) {
      setSections(groupContactsByAlphabet(contacts));
    }
  }, [contacts]);

  return {contacts, sections, error};
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
