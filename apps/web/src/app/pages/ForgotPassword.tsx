import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authDataAccess, useResource } from '@spesia/data-access';
import { ResetPasswordDto } from '@spesia/common';
import { useTranslation } from 'react-i18next';
import { Sweetalert } from '../components/ui/sweet-alert.tsx';
import { useUserStore } from '../store/userStore.ts';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [{error}, { resetPassword }] = useResource(authDataAccess);
    const { t } = useTranslation();
    const { logout } = useUserStore();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ResetPasswordDto>();

    const email = watch('email');

    const onSubmit = async (data: ResetPasswordDto) => {
        setIsLoading(true);
        try {

            await resetPassword(data);
            setIsLoading(false);
            await logout();


        } catch (err: any) {
            await Sweetalert({ text: err, icon: 'error' });
            setIsLoading(false);
        }

        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen w-full flex">
            <div style={{ backgroundColor: '#162b3f' }}
                 className="hidden lg:flex lg:w-1/2  items-center justify-center">
                <div className="p-16">
                    <div className="backdrop-blur-sm bg-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                            <img title="Spesia" src="../../assets/logo.png" alt="Logo" />
                        </h2>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-16 xl:px-24">
                <div className="w-full max-w-sm">
                    <Link to="/login" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to login
                    </Link>

                    {/* Form */}
                    {!isSubmitted ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Forgot Password</h1>
                                <p className="text-gray-600">Enter your email address and we'll send you a link to reset
                                    your password.</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            id="email"
                                            type="email"
                                            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!email || isLoading}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Enviando...' : 'Recuperar Senha'}

                                </button>
                            </form>
                        </>
                    ) :  (
                        <div className="text-center">
                            <div
                                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 mb-4">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check your email</h2>
                            <p className="text-gray-600 mb-8">
                                We've sent you a password reset link. Please check your email.
                            </p>
                            <Link
                                to="/login"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Back to login
                            </Link>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
