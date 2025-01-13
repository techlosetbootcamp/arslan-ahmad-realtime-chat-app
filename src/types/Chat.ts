import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigation';
import { RouteProp } from '@react-navigation/native';

type ChatScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Chat'
>;

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

export type ChatProps = {
  navigation?: ChatScreenNavigationProp;
  route?: ChatScreenRouteProp;
};
