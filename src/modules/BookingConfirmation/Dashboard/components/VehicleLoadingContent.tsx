import { Text, TextInput, View } from "react-native";
import {styles} from './../Loadingstatus.style'
import { IconCircleCheck, IconTruck } from "@tabler/icons-react-native";

interface VehicleLoadingContentProps {
  reportedTime: string;
  loadingTime: string;
  packagesLoaded: number;
  loadingDuration: string;
  completed: boolean;
}

export const VehicleLoadingContent = ({
  reportedTime,
  loadingTime,
  packagesLoaded,
  loadingDuration,
  completed,
}: VehicleLoadingContentProps) => {
  return (
    <View style={styles.loadingContainer}>
      {/* Information */}
      <View style={styles.loadingInfo}>
        <Text style={styles.loadingTitle}>
          Vehicle Reported at {reportedTime} Loading Time
        </Text>

        <Text style={styles.timer}>
          {loadingDuration}
        </Text>
      </View>

      {/* Starting / Complete */}
      <View style={styles.loadingStages}>
        <View style={styles.stage}>
          <Text style={styles.stageTitle}>
            Starting
          </Text>

          <View style={styles.imagePlaceholder}>
            {!completed && (
              <IconTruck
                size={32}
                color="#315E9F"
              />
            )}
          </View>
        </View>

        <View style={styles.stage}>
          <Text style={styles.stageTitle}>
            Complete
          </Text>

          <View style={styles.imagePlaceholder}>
            {completed && (
              <IconCircleCheck
                size={38}
                color="#315E9F"
              />
            )}
          </View>
        </View>
      </View>

      {/* Packages */}
      <View style={styles.packageRow}>
        <Text style={styles.packageLabel}>
          Number of Packages Loaded
        </Text>

        <TextInput
          value={String(packagesLoaded)}
          editable={false}
          style={styles.packageInput}
        />
      </View>
    </View>
  );
};