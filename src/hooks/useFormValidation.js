import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Validation function that returns errors object
 * @param {Function} onSubmit - Function to call on successful form submission
 * @returns {Object} - Form state and handlers
 */
const useFormValidation = (initialValues = {}, validateFn, onSubmit) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update form values when initialValues change (e.g., when editing a resource)
    useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    // Handle field change
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        setValues((prevValues) => ({
            ...prevValues,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Mark field as touched
        setTouched((prevTouched) => ({
            ...prevTouched,
            [name]: true,
        }));
    }, []);

    // Handle blur event to validate field
    const handleBlur = useCallback((e) => {
        const { name } = e.target;

        setTouched((prevTouched) => ({
            ...prevTouched,
            [name]: true,
        }));

        // Validate only this field
        if (validateFn) {
            const validationErrors = validateFn(values);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validationErrors[name],
            }));
        }
    }, [values, validateFn]);

    // Set a field value programmatically
    const setFieldValue = useCallback((field, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    }, []);

    // Mark field as touched programmatically
    const setFieldTouched = useCallback((field, isTouched = true) => {
        setTouched((prevTouched) => ({
            ...prevTouched,
            [field]: isTouched,
        }));
    }, []);

    // Reset form to initial values
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    // Handle form submission
    const handleSubmit = useCallback(async (e) => {
        if (e) e.preventDefault();

        // Validate all fields
        const validationErrors = validateFn ? validateFn(values) : {};
        setErrors(validationErrors);

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        // Check if there are any errors
        const hasErrors = Object.keys(validationErrors).length > 0;

        if (!hasErrors && onSubmit) {
            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } catch (err) {
                console.error('Form submission error:', err);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [values, validateFn, onSubmit]);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        resetForm,
    };
};

export default useFormValidation;
