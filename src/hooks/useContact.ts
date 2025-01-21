import {useEffect, useState} from 'react';
import {fetchContacts} from '../services/firebase';
import {User} from '../types/firestoreService';
import useAuth from './useAuth';

const userContacts = () => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [sections, setSections] = useState<{title: string; data: User[]}[]>([]);
  const {user} = useAuth();

  useEffect(() => {
    const loadContacts = async () => {
      if (user?.uid) {
        try {
          const fetchedContacts = await fetchContacts(user?.uid);
          setContacts(fetchedContacts);
          setSections(groupContactsByAlphabet(fetchedContacts));
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      }
    };

    loadContacts();
  }, []);

  return {contacts, sections};
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

export default userContacts;
