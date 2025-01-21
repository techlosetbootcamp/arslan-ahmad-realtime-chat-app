import {StyleSheet} from 'react-native';

export const ChatNavigatorStyles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  defaultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  defaultImageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chatDetails: {
    flex: 1,
  },
  chatText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
