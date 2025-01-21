import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';

const appNavigate = () => {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();
  return {navigation};
};

export default appNavigate;
