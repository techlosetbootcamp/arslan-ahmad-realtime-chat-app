import {StyleSheet} from 'react-native';
import {COLOR} from '../constants/colors';

export const profileStyles = StyleSheet.create({
  header: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '40%',
    alignSelf: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: COLOR.primary,
  },
  emailText: {
    fontSize: 16,
    color: COLOR.primary,
    marginBottom: 10,
  },
  error: {
    color: COLOR.red,
    fontSize: 14,
    marginTop: 10,
  },
  editButton: {
    position: 'absolute',
    bottom: 5,
    right: 15,
    width: 15,
    height: 15,
    borderRadius: 10,
    padding: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.black,
  },
});
