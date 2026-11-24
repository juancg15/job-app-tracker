import { Pressable, StyleSheet, Text, View } from "react-native";
import { STATUS_COLORS } from "../constants/statusColors";
import { Application } from "../types/application";

type Props = {
  application: Application;
  onPress: () => void;
};

export default function ApplicationCard({ application, onPress }: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Edit application for ${application.company}`}
    >
      <View style={styles.topRow}>
        <Text style={styles.company}>{application.company}</Text>

        <Text
          style={[
            styles.badge,
            {
              backgroundColor: STATUS_COLORS[application.status],
            },
          ]}
        >
          {application.status}
        </Text>
      </View>

      <Text style={styles.jobTitle}>{application.jobTitle}</Text>

      <Text style={styles.details}>{application.location}</Text>

      <Text style={styles.details}>Applied: {application.dateApplied}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  company: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#172554",
    flex: 1,
  },
  badge: {
    color: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  jobTitle: {
    fontSize: 16,
    color: "#334155",
    marginTop: 6,
  },
  details: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 5,
  },
});
