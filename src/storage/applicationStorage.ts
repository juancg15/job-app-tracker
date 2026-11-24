import AsyncStorage from "@react-native-async-storage/async-storage";
import { Application } from "../types/application";

const STORAGE_KEY = "job_applications";

export async function loadApplications(): Promise<Application[]> {
  const storedData = await AsyncStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    return [];
  }

  const parsedData = JSON.parse(storedData);

  return Array.isArray(parsedData) ? parsedData : [];
}

export async function saveApplications(
  applications: Application[],
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}
