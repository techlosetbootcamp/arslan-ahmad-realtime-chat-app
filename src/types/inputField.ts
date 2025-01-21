import { KeyboardTypeOptions } from "react-native";

export interface InputFieldProps {
  type: KeyboardTypeOptions;
  title: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  setVal: (val: string) => void;
  val: string;
}
