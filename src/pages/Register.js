import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateRequiredFields } from '../utils/validators';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check URL params for pre-selected role
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: roleParam || 'receiver', // Default to receiver if no role specified
        organizationName: '',
        phoneNumber: '',
        address: '',
        agreeToTerms: false,
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [step, setStep] = useState(1);

    // Optional fields based on role
    const [organizationRequired, setOrganizationRequired] = useState(false);

    useEffect(() => {
        // Check if organization name is required based on role
        setOrganizationRequired(formData.role !== 'individual');
    }, [formData.role]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });

        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: '',
            });
        }

        // Clear server error when user makes changes
        if (serverError) {
            setServerError('');
        }
    };

    const validateStep1 = () => {
        const errors = {};

        if (!formData.name) {
            errors.name = 'Name is required';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            errors.password = 'Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    };

    const validateStep2 = () => {
        const errors = {};
        const requiredFields = ['phoneNumber', 'address'];

        if (organizationRequired && !formData.organizationName) {
            errors.organizationName = 'Organization name is required';
        }

        if (!formData.phoneNumber) {
            errors.phoneNumber = 'Phone number is required';
        }

        if (!formData.address) {
            errors.address = 'Address is required';
        }

        if (!formData.agreeToTerms) {
            errors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    };

    const handleNext = () => {
        const validation = validateStep1();
        if (validation.isValid) {
            setStep(2);
        } else {
            setFormErrors(validation.errors);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateStep2();
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);
        setServerError('');

        try {
            // Remove confirmPassword field before sending to API
            const { confirmPassword, agreeToTerms, ...registrationData } = formData;

            const user = await register(registrationData);

            // Redirect based on user role
            if (user.role === 'donor') {
                navigate('/donor-dashboard');
            } else if (user.role === 'receiver') {
                navigate('/receiver-dashboard');
            } else if (user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {serverError}
                        </div>
                    )}

                    {/* Step indicator */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 1 ? 'bg-green-600 text-white' : 'bg-green-200 text-green-800'
                                }`}>
                                1
                            </div>
                            <div className="ml-2 text-sm font-medium">Account Details</div>
                        </div>
                        <div className="h-0.5 w-16 bg-gray-200"></div>
                        <div className="flex items-center">
                            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 2 ? 'bg-green-600 text-white' : 'bg-green-200 text-green-800'
                                }`}>
                                2
                            </div>
                            <div className="ml-2 text-sm font-medium">Profile Details</div>
                        </div>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={step === 1 ? handleNext : handleSubmit}>
                        {step === 1 ? (
                            /* Step 1: Account Details */
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`mt-1 appearance-none block w-full px-3 py-2 border ${formErrors.name ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`mt-1 appearance-none block w-full px-3 py-2 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`mt-1 appearance-none block w-full px-3 py-2 border ${formErrors.password ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                                    />
                                    {formErrors.password && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`mt-1 appearance-none block w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                                    />
                                    {formErrors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        I want to register as:
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    >
                                        <option value="donor">Food Donor</option>
                                        <option value="receiver">Food Receiver</option>
                                    </select>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Step 2: Profile Details */
                            <div className="space-y-4">
                                {organizationRequired && (
                                    <div>
                                        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                                            Organization Name
                                        </label>
                                        <input
                                            id="organizationName"
                                            name="organizationName"
                                            type="text"
                                            required={organizationRequired}
                                            value={formData.organizationName}
                                            onChange={handleChange}
                                            className={`mt-1 appearance-none block w-full px-3 py-2 border ${formErrors.organizationName ? 'border-red-300' : 'border-gray-300'
                                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                                        />
                                        {formErrors.organizationName && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.organizationName}</p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`mt-1 appearance-none block w-full px-3 py-2 border ${formErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                                    />
                                    {formErrors.phoneNumber && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        rows="3"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`mt-1 appearance-none block w-full px-3 py-2 border ${formErrors.address ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                                    ></textarea>
                                    {formErrors.address && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className={`h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded`}
                                    />
                                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                                        I agree to the <Link to="/terms" className="text-green-600 hover:text-green-500">Terms and Conditions</Link> and <Link to="/privacy" className="text-green-600 hover:text-green-500">Privacy Policy</Link>
                                    </label>
                                </div>
                                {formErrors.agreeToTerms && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.agreeToTerms}</p>
                                )}

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex-1"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex-1`}
                                    >
                                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;
