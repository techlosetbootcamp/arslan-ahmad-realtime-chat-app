import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {addContact} from '../services/firebase';
import {User} from '../types/firestoreService';
import SearchBar from '../components/Search';
import useAuth from '../hooks/useAuth';
import {useAppDispatch, useAppSelector} from '../store/store';

const Search = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [groups, setGroups] = useState<any[]>([]);
  const {user} = useAuth();
  const dispatch = useAppDispatch();
  const {users: usersInStore} = useAppSelector(state => state.users);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(usersInStore);
  const {contacts} = useAppSelector(state => state.contacts);

  const handleSearch = (text: string) => {
    setSearchText(text);

    const filtered = usersInStore.filter(
      (user: User) =>
        (user.displayName?.toLowerCase().includes(text.toLowerCase()) ||
          user.email?.toLowerCase().includes(text.toLowerCase())) &&
        !contacts.some(contact => contact.uid === user.uid),
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
        dispatch({type: 'contacts/addContact', payload: contactId});
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const renderUserItem = ({item}: {item: User}) => {
    const isContact = contacts.some(contact => contact.uid === item.uid);

    return (
      <View style={styles.itemContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={
              item.photoURL
                ? {uri: item.photoURL}
                : require('../assets/imgs/profile_placeholder_image.png')
            }
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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View>
          {item.participants
            .slice(0, 4)
            .map((participant: User, index: number) => (
              <Image
                key={index}
                source={
                  participant.photoURL
                    ? {uri: participant.photoURL}
                    : require('../assets/imgs/profile_placeholder_image.png')
                }
              />
            ))}
        </View>
        <Text style={styles.userName}>
          {item.participants
            .map((participant: User) => participant.displayName)
            .join(', ')}
        </Text>
      </View>
    </View>
  );

  const renderNoResultsMessage = (type: 'People' | 'Group') => (
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
        <Text style={styles.sectionTitle}>People</Text>
        {filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item, index) => item.uid || `key-${index}`}
            renderItem={renderUserItem}
          />
        ) : (
          renderNoResultsMessage('People')
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
    backgroundColor: '#ccc',
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
