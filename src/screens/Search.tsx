import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {addContact, fetchUsers} from '../services/firebase';
import {User} from '../types/firestoreService';
import SearchBar from '../components/Search';
import useAuth from '../hooks/useAuth';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../store/store';
import {fetchUserData} from '../store/slices/userSlice';
import useContacts from '../hooks/useContact';

const Search = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const {contacts} = useContacts();
  const {user} = useAuth();
  const dispatch: AppDispatch = useDispatch();

  const fetchAllUsers = async () => {
    if (user?.uid) {
      const users = await fetchUsers(user?.uid);
      setAllUsers(users);
      setFilteredUsers(users);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);

    const filtered = allUsers.filter(
      (user: User) =>
        user.displayName?.toLowerCase().includes(text.toLowerCase()) ||
        user.email?.toLowerCase().includes(text.toLowerCase()),
    );

    const filteredGroups = groups.filter((group: any) =>
      group.name.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredUsers(filtered);
    setGroups(filteredGroups);
  };

  const handleAddContact = async (contactId: string) => {
    try {
      if (contactId) {
        await addContact(user?.uid || '', contactId);
        dispatch(fetchUserData(user?.uid || ''));
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (searchText === '') {
      setFilteredUsers(allUsers);
    }
  }, [searchText]);

  const renderUserItem = ({item}: {item: User}) => {
    const isContact = item?.uid
      ? contacts.map(contact => contact.uid).includes(item?.uid)
      : false;
    return (
      <View style={styles.itemContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{
              uri:
                item.photoURL || '../assets/imgs/profile_placeholder_image.png',
            }}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{item.displayName}</Text>
        </View>
        {!isContact && (
          <TouchableOpacity
            onPress={() => handleAddContact(item?.uid || '')}
            style={styles.addContactButton}>
            <Image
              source={require('../assets/icons/add_user.png')}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderGroupItem = ({item}: {item: any}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.groupImage}} style={styles.userImage} />
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  );

  const renderNoResultsMessage = (type: 'User' | 'Group') => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>No {type} found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        searchText={searchText}
        setSearchText={text => handleSearch(text as string)}
      />
      <View style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Users</Text>
        {filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item, index) => item.uid || `key-${index}`}
            renderItem={renderUserItem}
          />
        ) : (
          renderNoResultsMessage('User')
        )}

        {/* Group Results */}
        <Text style={styles.sectionTitle}>Groups</Text>
        {groups.length > 0 ? (
          <FlatList
            data={groups}
            keyExtractor={item => item.id}
            renderItem={renderGroupItem}
          />
        ) : (
          renderNoResultsMessage('Group')
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  resultsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  addContactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#ccc',
    width: 40,
    height: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderColor: '#ff0000',
    borderWidth: 1,
  },
  userName: {
    fontSize: 16,
    color: '#333',
  },
  noResultsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 15,
    color: '#888',
  },
});

export default Search;
