import {KeyboardType} from 'react-native';

export type InputFieldProps = {
  type?: KeyboardType;
  title: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  setVal: (val: string) => void;
  setError?: (val: string) => void;
  val: string;
};
