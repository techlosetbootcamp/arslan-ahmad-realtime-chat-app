// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "./navigation";
// import { RouteProp } from "@react-navigation/native";

// type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export interface HomeScreenProps {
  navigation: {
    navigate: (screen: string, params: any) => void;
  };
}