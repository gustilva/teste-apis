import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Loader2, CheckCircle, ArrowLeft, FacebookIcon, LockIcon } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authDataAccess, useResource } from '@spesia/data-access';
import { ConfirmPasswordDto } from '@spesia/common';
import { Sweetalert } from '../components/ui/sweet-alert.tsx';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const userId = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [eerror, setError] = useState<string | null>(null);
    const [{ error }, { confirmResetPassword }] = useResource(authDataAccess);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ConfirmPasswordDto & { confirmPassword: string }>();

    const password = watch('newPassword');

    const onSubmit = async (data: ConfirmPasswordDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await confirmResetPassword({
                userId: +userId,
                newPassword: data.newPassword,
                token: token
            });

            await Sweetalert({
                text: 'Password Reset',
                html: 'Your password has been successfully updated',
                icon: 'success'
            });

            if (response) {
                setIsSuccess(true);
                navigate('/login');
            }

        } catch (err) {
            await Sweetalert({ text: 'Error', html: err?.toString(), icon: 'error' });
        } finally {
            setIsSuccess(false);
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-red-500 mb-4">
                        <Lock className="h-12 w-12 mx-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
                    <p className="text-gray-600 mb-6">
                        The password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link
                        to="/apps/web/src/app/pages/ForgotPassword"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex">
            {/* Left side - decorative */}
            <div style={{ backgroundColor: '#162b3f' }} className=" lg:flex lg:w-1/2  items-center justify-center">
                <div className="items-center text-center">
                    <div className="backdrop-blur-sm bg-white/100 p-8 rounded-2xl shadow-xl text-center items-center">
                        <div>
                            <img src="../../assets/logo.png" alt="Logo" />
                            <p className="text-gray-600">Create a new secure password for your account</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - reset password form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-16 xl:px-24">
                <div className="w-full max-w-sm">
                    <Link to="/login" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to login
                    </Link>

                    {!isSuccess ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create New Password</h1>
                                <p className="text-gray-600">Your password must be at least 8 characters and include a
                                    mix of letters and numbers.</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                                    {eerror}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register('newPassword', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 2,
                                                    message: 'Password must be at least 8 characters'
                                                }
                                                /*  pattern: {
                                                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                                                      message: "Password must contain at least one letter and one number",
                                                  },*/
                                            })}
                                            id="newPassword"
                                            type="password"
                                            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                                            placeholder="Create a new password"
                                        />
                                    </div>
                                    {errors.newPassword && (
                                        <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register('confirmPassword', {
                                                required: 'Please confirm your password',
                                                validate: (value) => value === password || 'Passwords do not match'
                                            })}
                                            id="confirmPassword"
                                            type="password"
                                            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                                            placeholder="Confirm your new password"
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div
                                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Password Reset Complete</h2>
                            <p className="text-gray-600 mb-8">
                                Your password has been successfully updated. You will be redirected to the login page in
                                a moment.
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

export default ResetPassword;
