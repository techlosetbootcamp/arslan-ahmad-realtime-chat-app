import {Dimensions, StyleSheet} from 'react-native';

const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 8,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
  },
  header: {
    flex: 2,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  Icon: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 50,
    width: 30,
    height: 30,
  },
  chatText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    color: '#888',
  },
});

export default HomeStyles;
