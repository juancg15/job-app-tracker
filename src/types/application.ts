import { ApplicationFormData } from "../schemas/applicationSchema";

export type Application = ApplicationFormData & {
  id: string;
};
