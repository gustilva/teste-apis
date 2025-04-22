import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Sweetalert } from '../components/ui/sweet-alert.tsx';
import { authDataAccess, userDataAccess, useResource } from '@spesia/data-access';
import { LoginDto } from '@spesia/common';
import { useUserStore } from '../store/userStore.ts';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setTokens } = useUserStore();
    const [, { login }] = useResource(authDataAccess);
    const [, { resendConfirmationEmail }] = useResource(userDataAccess);

    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginDto>();

    const onSubmit = async (data: LoginDto) => {

        try {
            setIsLoading(true);

            const response = await login(data);

            if (response.accessToken) {

                const user = { id: response.userId, email: response.userEmail, role: response.userRole };

                setTokens(response.accessToken, response.refreshToken, user);
                setIsLoading(false);

                navigate('/home');
            }
        } catch (err: any) {
            if (err.response.data.statusCode === 423) {
                const resp = await Sweetalert({
                    text: err.response?.data?.message || t('login.failed'),
                    icon: 'warning',
                    confirmButtonText: 'Reenviar email de confirmação',
                    showCloseButton: true
                });

                if (resp && data.email) {
                     await userDataAccess.resendConfirmationEmail({
                         email: data.email,
                     });

                     await Sweetalert({
                         text: t('login.emailSent'),
                         icon: 'success',
                     });
                }
            } else {
                await Sweetalert({
                    text: err.response?.data?.message || t('login.failed'),
                    icon: 'error'
                });
            }

            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Left side - decorative */}
            <div style={{ backgroundColor: '#162b3f' }}
                 className="hidden lg:flex lg:w-1/2  items-center justify-center">
                <div className="p-16">
                    <div className="backdrop-blur-sm bg-white/100 p-8 rounded-2xl shadow-xl">
                        <img src="../../assets/logo.png" alt="Logo" />

                    </div>
                </div>
            </div>

            {/* Right side - login form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-16 xl:px-24">
                <div className="w-full max-w-sm">
                    {/* Logo */}
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center mb-10">
                            <img src="../../assets/logo.png" alt="Logo" className="mb-10" />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900">Sign In</h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('password', { required: 'Password is required' })}
                                    id="password"
                                    type="password"
                                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* <div className="flex items-center">
                            <input
                                {...register('rememberMe')}
                                type="checkbox"
                                id="rememberMe"
                                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>*/}

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-32 flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-gray-900 hover:text-gray-700">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
