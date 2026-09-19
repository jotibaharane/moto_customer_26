import { Text, View } from "react-native";
import {styles} from "./../Loadingstatus.style";

interface ReceiptRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

export const ReceiptRow = ({
  label,
  value,
  bold = false,
}: ReceiptRowProps) => {
  return (
    <View style={styles.receiptRow}>
      <Text
        style={[
          styles.receiptLabel,
          bold && styles.boldText,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.receiptValue,
          bold && styles.boldText,
        ]}
      >
        {value}
      </Text>
    </View>
  );
};