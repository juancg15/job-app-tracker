import { useEffect } from "react";
import { formatDate } from "../utils/formatDate";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { router, Stack, useLocalSearchParams } from "expo-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
    ApplicationFormData,
    applicationSchema,
    STATUSES,
} from "../schemas/applicationSchema";

import FormInput from "../components/FormInput";
import { STATUS_COLORS } from "../constants/statusColors";
import { useApplications } from "../context/ApplicationContext";

const DEFAULT_VALUES: ApplicationFormData = {
  company: "",
  jobTitle: "",
  location: "",
  dateApplied: "",
  status: "Applied",
  salaryMin: "",
  salaryMax: "",
  interviewDate: "",
  offerAmount: "",
  contactEmail: "",
  notes: "",
};

export default function ApplicationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    applications,
    loading,
    addApplication,
    updateApplication,
    removeApplication,
  } = useApplications();

  const existingApplication = applications.find(
    (application) => application.id === id,
  );

  const isEditing = !!existingApplication;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (existingApplication) {
      reset(existingApplication);
    }
  }, [existingApplication, reset]);

  const status = watch("status");
  const offerAmount = watch("offerAmount");

  async function onSubmit(data: ApplicationFormData) {
    try {
      if (existingApplication) {
        await updateApplication(existingApplication.id, data);
      } else {
        await addApplication(data);
      }

      router.back();
    } catch {
      Alert.alert(
        "Save failed",
        "Unable to save the application. Please try again.",
      );
    }
  }

  function confirmDelete() {
    if (!existingApplication) return;

    Alert.alert("Delete application?", "This cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await removeApplication(existingApplication.id);
            router.back();
          } catch {
            Alert.alert("Delete failed", "Unable to delete the application.");
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading application...</Text>
      </View>
    );
  }

  if (id && !existingApplication) {
    return (
      <View style={styles.container}>
        <Text>Application not found.</Text>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen
        options={{
          title: isEditing ? "Edit Application" : "Add Application",
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.heading}>
          {isEditing ? "Update your application" : "New job application"}
        </Text>

        <Text style={styles.subtitle}>Fields marked with * are required.</Text>

        {/* Company */}
        <Controller
          control={control}
          name="company"
          render={({ field }) => (
            <FormInput
              label="Company *"
              placeholder="e.g. Microsoft"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.company?.message}
            />
          )}
        />

        {/* Job Title */}
        <Controller
          control={control}
          name="jobTitle"
          render={({ field }) => (
            <FormInput
              label="Job Title *"
              placeholder="e.g. Software Developer"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.jobTitle?.message}
            />
          )}
        />

        {/* Location */}
        <Controller
          control={control}
          name="location"
          render={({ field }) => (
            <FormInput
              label="Location *"
              placeholder="e.g. Calgary or Remote"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.location?.message}
            />
          )}
        />

        {/* Date Applied with automatic formatting */}
        <Controller
          control={control}
          name="dateApplied"
          render={({ field }) => (
            <FormInput
              label="Date Applied *"
              placeholder="YYYY-MM-DD"
              keyboardType="number-pad"
              maxLength={10}
              value={field.value}
              onChangeText={(text) => field.onChange(formatDate(text))}
              onBlur={field.onBlur}
              error={errors.dateApplied?.message}
            />
          )}
        />

        {/* Application Status */}
        <Text style={styles.label}>Status *</Text>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <View style={styles.statusRow}>
              {STATUSES.map((item) => (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: field.value === item,
                  }}
                  onPress={() => field.onChange(item)}
                  style={[
                    styles.statusButton,
                    {
                      borderColor: STATUS_COLORS[item],
                    },
                    field.value === item && {
                      backgroundColor: STATUS_COLORS[item],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          field.value === item
                            ? "#ffffff"
                            : STATUS_COLORS[item],
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />

        {errors.status && (
          <Text style={styles.error}>{errors.status.message}</Text>
        )}

        {/* Minimum Salary */}
        <Controller
          control={control}
          name="salaryMin"
          render={({ field }) => (
            <FormInput
              label="Minimum Salary"
              placeholder="e.g. 50000"
              keyboardType="numeric"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.salaryMin?.message}
            />
          )}
        />

        {/* Maximum Salary */}
        <Controller
          control={control}
          name="salaryMax"
          render={({ field }) => (
            <FormInput
              label="Maximum Salary"
              placeholder="e.g. 80000"
              keyboardType="numeric"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.salaryMax?.message}
            />
          )}
        />

        {/* Interview Date with automatic formatting */}
        {status === "Interview" && (
          <Controller
            control={control}
            name="interviewDate"
            render={({ field }) => (
              <FormInput
                label="Interview Date *"
                placeholder="YYYY-MM-DD"
                keyboardType="number-pad"
                maxLength={10}
                value={field.value}
                onChangeText={(text) => field.onChange(formatDate(text))}
                onBlur={field.onBlur}
                error={errors.interviewDate?.message}
              />
            )}
          />
        )}

        {/* Hidden Interview Date Error */}
        {status !== "Interview" && errors.interviewDate && (
          <View style={styles.warning}>
            <Text style={styles.error}>{errors.interviewDate.message}</Text>

            <Pressable
              onPress={() =>
                setValue("interviewDate", "", {
                  shouldValidate: true,
                })
              }
            >
              <Text style={styles.link}>Clear interview date</Text>
            </Pressable>
          </View>
        )}

        {/* Offer Amount */}
        {status === "Offer" && (
          <Controller
            control={control}
            name="offerAmount"
            render={({ field }) => (
              <FormInput
                label="Offer Amount *"
                placeholder="e.g. 75000"
                keyboardType="numeric"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.offerAmount?.message}
              />
            )}
          />
        )}

        {/* Offer Amount Validation */}
        {status !== "Offer" && offerAmount !== "" && (
          <View style={styles.warning}>
            <Text style={styles.label}>
              Previous Offer Amount: {offerAmount}
            </Text>

            {errors.offerAmount && (
              <Text style={styles.error}>{errors.offerAmount.message}</Text>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setValue("offerAmount", "", {
                  shouldValidate: true,
                })
              }
            >
              <Text style={styles.link}>Clear offer amount</Text>
            </Pressable>
          </View>
        )}

        {/* Contact Email */}
        <Controller
          control={control}
          name="contactEmail"
          render={({ field }) => (
            <FormInput
              label="Contact Email"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.contactEmail?.message}
            />
          )}
        />

        {/* Notes */}
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <FormInput
              label="Notes (maximum 500 characters)"
              placeholder="Additional information..."
              multiline
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.notes?.message}
            />
          )}
        />

        <Text style={styles.characterCount}>
          {watch("notes").length}/500 characters
        </Text>

        {/* Save Button */}
        <Pressable
          style={[styles.saveButton, isSubmitting && { opacity: 0.5 }]}
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={() => handleSubmit(onSubmit)()}
        >
          <Text style={styles.buttonText}>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Save Application"}
          </Text>
        </Pressable>

        {/* Delete Button */}
        {isEditing && (
          <Pressable
            style={styles.deleteButton}
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={confirmDelete}
          >
            <Text style={styles.buttonText}>Delete Application</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#172554",
  },
  subtitle: {
    color: "#64748b",
    marginTop: 6,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  statusButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  characterCount: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "right",
    marginTop: -10,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#172554",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginBottom: 8,
  },
  warning: {
    backgroundColor: "#fef2f2",
    borderColor: "#dc2626",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  link: {
    color: "#2563eb",
    fontWeight: "600",
    paddingVertical: 8,
  },
});
