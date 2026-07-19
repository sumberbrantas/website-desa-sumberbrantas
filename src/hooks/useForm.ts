import { useState, useCallback } from "react";

interface FormField {
  value: string;
  error?: string;
  touched?: boolean;
}

interface FormState {
  [key: string]: FormField;
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

interface FormConfig {
  [key: string]: ValidationRule;
}

export const useForm = <T extends Record<string, any>>(initialValues: T, validationRules: FormConfig = {}) => {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach((key) => {
      state[key] = {
        value: initialValues[key] || "",
        error: undefined,
        touched: false,
      };
    });
    return state;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      const rule = validationRules[name];
      if (!rule) return undefined;

      if (rule.required && !value.trim()) {
        return "Field ini wajib diisi";
      }

      if (rule.minLength && value.length < rule.minLength) {
        return `Minimal ${rule.minLength} karakter`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return `Maksimal ${rule.maxLength} karakter`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return "Format tidak valid";
      }

      if (rule.custom) {
        return rule.custom(value);
      }

      return undefined;
    },
    [validationRules]
  );

  const setFieldValue = useCallback(
    (name: string, value: string) => {
      setFormState((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: validateField(name, value),
          touched: true,
        },
      }));
    },
    [validateField]
  );

  const setFieldError = useCallback((name: string, error: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      },
    }));
  }, []);

  const clearFieldError = useCallback((name: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error: undefined,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    const resetState: FormState = {};
    Object.keys(initialValues).forEach((key) => {
      resetState[key] = {
        value: initialValues[key] || "",
        error: undefined,
        touched: false,
      };
    });
    setFormState(resetState);
    setIsSubmitting(false);
  }, [initialValues]);

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newState = { ...formState };

    Object.keys(formState).forEach((key) => {
      const error = validateField(key, formState[key].value);
      newState[key] = {
        ...newState[key],
        error,
        touched: true,
      };
      if (error) {
        isValid = false;
      }
    });

    setFormState(newState);
    return isValid;
  }, [formState, validateField]);

  const getFieldProps = useCallback(
    (name: string) => {
      return {
        value: formState[name]?.value || "",
        error: formState[name]?.error,
        touched: formState[name]?.touched,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          setFieldValue(name, e.target.value);
        },
      };
    },
    [formState, setFieldValue]
  );

  const getFormValues = useCallback((): T => {
    const values = {} as T;
    Object.keys(formState).forEach((key) => {
      (values as any)[key] = formState[key].value;
    });
    return values;
  }, [formState]);

  const hasErrors = Object.values(formState).some((field) => field.error);
  const isFormValid = !hasErrors && Object.values(formState).every((field) => field.touched);

  return {
    formState,
    isSubmitting,
    setIsSubmitting,
    setFieldValue,
    setFieldError,
    clearFieldError,
    resetForm,
    validateForm,
    getFieldProps,
    getFormValues,
    hasErrors,
    isFormValid,
  };
};
