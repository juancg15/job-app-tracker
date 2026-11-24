import { z } from "zod";

export const STATUSES = ["Applied", "Interview", "Offer", "Rejected"] as const;

function getToday() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")}`;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export const applicationSchema = z
  .object({
    company: z.string().trim().min(1, "Enter the company name"),

    jobTitle: z.string().trim().min(1, "Enter the job title"),

    location: z.string().trim().min(1, "Enter a city or Remote"),

    dateApplied: z.string().refine(isValidDate, {
      message: "Enter a valid date in YYYY-MM-DD format",
    }),

    status: z.enum(STATUSES, {
      message: "Select an application status",
    }),

    salaryMin: z
      .string()
      .regex(/^\d*$/, "Enter whole numbers only, without $ or commas"),

    salaryMax: z
      .string()
      .regex(/^\d*$/, "Enter whole numbers only, without $ or commas"),

    interviewDate: z
      .string()
      .refine((value) => value === "" || isValidDate(value), {
        message: "Enter a valid date in YYYY-MM-DD format",
      }),

    offerAmount: z
      .string()
      .regex(/^\d*$/, "Enter a whole number without $ or commas"),

    contactEmail: z.email("Enter a valid email address").or(z.literal("")),

    notes: z.string().max(500, "Notes cannot exceed 500 characters"),
  })

  // Rule 1: Date applied cannot be in the future.
  .refine((data) => data.dateApplied <= getToday(), {
    message: "Date applied cannot be in the future",
    path: ["dateApplied"],
  })

  // Rule 2: Maximum salary must be at least minimum.
  .refine(
    (data) =>
      data.salaryMin === "" ||
      data.salaryMax === "" ||
      Number(data.salaryMax) >= Number(data.salaryMin),
    {
      message: "Maximum salary must be at least the minimum salary",
      path: ["salaryMax"],
    },
  )

  // Rule 3: Interview status requires an interview date.
  .refine((data) => data.status !== "Interview" || data.interviewDate !== "", {
    message: "Enter the interview date",
    path: ["interviewDate"],
  })

  // Rule 4: Interview date cannot precede date applied.
  .refine(
    (data) =>
      data.interviewDate === "" || data.interviewDate >= data.dateApplied,
    {
      message: "Interview date must be on or after the date applied",
      path: ["interviewDate"],
    },
  )

  // Rule 5: Offer status requires a whole-number amount.
  .refine((data) => data.status !== "Offer" || /^\d+$/.test(data.offerAmount), {
    message: "Enter a whole-number offer amount",
    path: ["offerAmount"],
  })

  // Rule 6: Other statuses cannot have an offer amount.
  .refine((data) => data.status === "Offer" || data.offerAmount === "", {
    message: "Offer amount must be empty unless the status is Offer",
    path: ["offerAmount"],
  });

export type ApplicationFormData = z.infer<typeof applicationSchema>;
