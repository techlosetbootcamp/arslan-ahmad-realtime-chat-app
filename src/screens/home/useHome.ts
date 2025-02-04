import useNavigation from '../../hooks/useNavigationHook';
import {useAppSelector} from '../../store/store';

const useHome = () => {
  const {chatLoader} = useNavigation();
  const {chats} = useAppSelector(state => state.chat);

  return {chats, chatLoader};
};

export default useHome;
