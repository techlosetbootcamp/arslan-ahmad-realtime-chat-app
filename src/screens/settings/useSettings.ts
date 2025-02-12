import {useAppSelector} from '../../store/store';
import appNavigate from '../../hooks/useNavigationHook';

const useAppSettings = () => {
  const user = useAppSelector(state => state.user);

  const {navigation} = appNavigate();
  return {
    user,
    navigation,
  };
};

export default useAppSettings;

