// src/hooks/useForm.ts
/**
 * Custom hook for form state management and validation
 */

import { useState, useCallback, FormEvent, ChangeEvent } from 'react';

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T | undefined) => string | null;
}

export interface FieldConfig<T = any> {
  initialValue: T;
  validation?: ValidationRule<T>;
}

export interface FormConfig<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FieldConfig<T[K]>;
  };
  onSubmit: (values: T) => Promise<void> | void;
}

export interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (field: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => boolean;
}

export function useForm<T extends Record<string, any>>(
  config: FormConfig<T>
): UseFormReturn<T> {
  // Initialize state from config
  const initialValues = Object.entries(config.fields).reduce(
    (acc, [key, field]) => {
      acc[key as keyof T] = (field as FieldConfig).initialValue;
      return acc;
    },
    {} as T
  );

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (field: keyof T): string | null => {
      const fieldConfig = config.fields[field];
      const value = values[field];
      const rules = fieldConfig?.validation;

      if (!rules) {
        return null;
      }

      // Required validation
      if (rules.required) {
        if (value === null || value === undefined || value === '') {
          return 'This field is required';
        }
      }

      // String-specific validations
      if (typeof value === 'string') {
        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
          return `Minimum length is ${rules.minLength} characters`;
        }

        // Max length validation
        if (rules.maxLength && value.length > rules.maxLength) {
          return `Maximum length is ${rules.maxLength} characters`;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
          return 'Invalid format';
        }
      }

      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
          return customError;
        }
      }

      return null;
    },
    [config.fields, values]
  );

  /**
   * Validate entire form
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(config.fields).forEach((field) => {
      const error = validateField(field as keyof T);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [config.fields, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (field: keyof T) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setValues((prev) => ({ ...prev, [field]: value }));

        // Clear error on change if field was touched
        if (touched[field]) {
          const error = validateField(field);
          setErrors((prev) => ({ ...prev, [field]: error || undefined }));
        }
      },
    [touched, validateField]
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate on blur
      const error = validateField(field);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [validateField]
  );

  /**
   * Set field value programmatically
   */
  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Set field error programmatically
   */
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(config.fields).reduce(
        (acc, field) => {
          acc[field as keyof T] = true;
          return acc;
        },
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      // Validate form
      const isValid = validateForm();

      if (!isValid) {
        return;
      }

      // Submit form
      setIsSubmitting(true);
      try {
        await config.onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [config, values, validateForm]
  );

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateField,
    validateForm,
  };
}
