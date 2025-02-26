import {RootStackParamList} from './navigation';

export type SettingsItemProps = {
  title: string;
  icon?: string;
  subtext?: string;
  link: keyof RootStackParamList | null;
};
