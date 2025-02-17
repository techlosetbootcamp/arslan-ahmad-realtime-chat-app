import { ImageSourcePropType } from "react-native";

export interface IconButtonProps {
    loader?: boolean;
    src: ImageSourcePropType;
    onPress: () => void;
    color?: string;
    size?: {
        width: number;
        height: number;
    };
}