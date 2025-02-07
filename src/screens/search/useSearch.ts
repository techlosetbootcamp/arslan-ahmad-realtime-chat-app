import {useState} from 'react';
import {addContact} from '../../services/contacts';
import {addContact as addContactToStore} from '../../store/slices/contacts.slice';
import {addUserToContact} from '../../store/slices/user.slice';
import useAuth from '../../hooks/useAuth';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {saveUserToStorage} from '../../services/async_storage';
import {User} from '../../types/firestoreService';
import {showToast} from '../../components/Toast';

const appSearch = () => {
  const [searchText, setSearchText] = useState<string>('');
  const {user} = useAuth();
  const dispatch = useAppDispatch();
  const {users: usersInStore} = useAppSelector(state => state.users);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(usersInStore);
  const {contacts} = useAppSelector(state => state.contacts);

  const handleSearch = (text: string) => {
    setSearchText(text);

    const filtered = usersInStore.filter(
      (user: User) =>
        user.displayName?.toLowerCase().includes(text.toLowerCase()) ||
        user.email?.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredUsers(filtered);
  };

  const handleAddContact = async (contactId: string) => {
    try {
      if (contactId) {
        dispatch(addContactToStore(contactId));
        dispatch(addUserToContact(contactId));
        await addContact(user?.uid || '', contactId);
        if (user) {
          await saveUserToStorage(user);
        }
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      showToast('Error', 'Failed to add contact', 'error');
    }
  };

  return {
    searchText,
    setSearchText,
    filteredUsers,
    handleSearch,
    handleAddContact,
    contacts,
  };
};

export default appSearch;
