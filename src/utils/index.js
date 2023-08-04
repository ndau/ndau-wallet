import { Dimensions } from "react-native"

export const isSmallerDivce = () => {
  const height = Dimensions.get('window').height;
  return height < 700;
}