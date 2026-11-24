import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ApplicationCard from "../components/ApplicationCard";
import { STATUS_COLORS } from "../constants/statusColors";
import { useApplications } from "../context/ApplicationContext";
import { STATUSES } from "../schemas/applicationSchema";

const FILTERS = ["All", ...STATUSES] as const;

type Filter = (typeof FILTERS)[number];

export default function HomeScreen() {
  const { applications, loading } = useApplications();
  const [filter, setFilter] = useState<Filter>("All");

  const filteredApplications = applications
    .filter((application) => filter === "All" || application.status === filter)
    .sort((a, b) => b.dateApplied.localeCompare(a.dateApplied));

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#172554" />
        <Text>Loading applications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Applications</Text>

      <Text style={styles.subtitle}>Track your career journey.</Text>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Total Applications</Text>

        <Text style={styles.total}>{applications.length}</Text>

        <View style={styles.summaryRow}>
          {STATUSES.map((status) => (
            <View key={status} style={styles.summaryItem}>
              <Text style={[styles.count, { color: STATUS_COLORS[status] }]}>
                {applications.filter((item) => item.status === status).length}
              </Text>

              <Text style={styles.summaryLabel}>{status}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              accessibilityRole="button"
              accessibilityState={{
                selected: filter === item,
              }}
              style={[
                styles.filterButton,
                filter === item && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ApplicationCard
            application={item}
            onPress={() =>
              router.push({
                pathname: "/application",
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No applications found</Text>

            <Text style={styles.emptyText}>
              {filter === "All"
                ? "Add your first job application to get started."
                : `You have no applications with the ${filter} status.`}
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.addButton}
        accessibilityRole="button"
        onPress={() => router.push("/application")}
      >
        <Text style={styles.addButtonText}>+ Add Application</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#172554",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  summary: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryTitle: {
    fontSize: 14,
    color: "#64748b",
  },
  total: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#172554",
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  count: {
    fontSize: 22,
    fontWeight: "bold",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#475569",
    marginTop: 4,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: "#172554",
  },
  filterText: {
    color: "#334155",
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#ffffff",
  },
  list: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
  },
  emptyText: {
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },
  addButton: {
    backgroundColor: "#172554",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
});
