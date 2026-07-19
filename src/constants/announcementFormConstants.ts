export const PRIORITY_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "penting", label: "Penting" },
  { value: "urgent", label: "Urgent" },
];

export const FORM_FIELDS = {
  TITLE: "title",
  CONTENT: "content", 
  START_DATE: "startDate",
  END_DATE: "endDate",
  PRIORITY: "priority",
} as const;

export const FORM_VALIDATION = {
  TITLE: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  CONTENT: {
    required: true,
    minLength: 10,
    maxLength: 5000,
  },
  START_DATE: {
    required: true,
  },
  END_DATE: {
    required: true,
  },
  PRIORITY: {
    required: false,
  },
} as const;
