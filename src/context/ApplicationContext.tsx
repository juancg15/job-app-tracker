import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { Alert } from "react-native";
import { ApplicationFormData } from "../schemas/applicationSchema";
import { Application } from "../types/application";

import {
    loadApplications,
    saveApplications,
} from "../storage/applicationStorage";

type ApplicationContextType = {
  applications: Application[];
  loading: boolean;
  addApplication: (data: ApplicationFormData) => Promise<void>;
  updateApplication: (id: string, data: ApplicationFormData) => Promise<void>;
  removeApplication: (id: string) => Promise<void>;
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined,
);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        const storedApplications = await loadApplications();
        setApplications(storedApplications);
      } catch (error) {
        console.error("Failed to load applications:", error);

        Alert.alert("Storage error", "Unable to load saved applications.");
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  async function persistApplications(updated: Application[]) {
    try {
      await saveApplications(updated);
      setApplications(updated);
    } catch (error) {
      console.error("Failed to save applications:", error);
      throw error;
    }
  }

  async function addApplication(data: ApplicationFormData) {
    const newApplication: Application = {
      ...data,
      id: Date.now().toString(),
    };

    await persistApplications([...applications, newApplication]);
  }

  async function updateApplication(id: string, data: ApplicationFormData) {
    const updated = applications.map((application) =>
      application.id === id ? { ...data, id } : application,
    );

    await persistApplications(updated);
  }

  async function removeApplication(id: string) {
    const updated = applications.filter((application) => application.id !== id);

    await persistApplications(updated);
  }

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        loading,
        addApplication,
        updateApplication,
        removeApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error("useApplications must be used inside ApplicationProvider");
  }

  return context;
}
