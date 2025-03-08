import {Pet} from "@/types/index";
import {StyleSheet} from "react-native";

export interface TabsProps {
  pet: Pet;
  setShowModal: (show: boolean) => void;
  styles: StyleSheet.NamedStyles<any>;
  showModal: boolean;
}
