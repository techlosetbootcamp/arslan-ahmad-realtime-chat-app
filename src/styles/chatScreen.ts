import { color } from '../constants/colors';
import { StyleSheet } from "react-native";

export 
const chatScreenStyles = StyleSheet.create({
  container: {flex: 1},
  messageContainer: {padding: 10, marginVertical: 3, maxWidth: '80%'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  attachmentButton: {
    padding: 5,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 45, 
    textAlignVertical: 'top',
    backgroundColor: 'rgba(231, 231, 231,0.4)',
  },
  input: {
    fontSize: 16,
    color: 'black',
    width: '80%',
  },
  inputIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  cameraButton: {
    padding: 10,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderRadius: 20,
  },
  participantMessage: {
    alignSelf: 'flex-start',
  },
  userMessageText: {
    color: 'white',
    fontSize: 16,
    padding: 8,
    backgroundColor: '#3D4A7A',
    borderRadius: 18,
  },
  participantMessageText: {
    color: 'black',
    fontSize: 16,
    backgroundColor: '#E4E6EB',
    padding: 8,
    borderRadius: 18,
  },
  timestampText: {
    color: '#333',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
});
