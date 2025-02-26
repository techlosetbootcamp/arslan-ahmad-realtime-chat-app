import {ImageSourcePropType} from 'react-native';

export type IconButtonProps = {
  loader?: boolean;
  src: ImageSourcePropType;
  onPress: () => void;
  color?: string;
  size?: {
    width: number;
    height: number;
  };
};
