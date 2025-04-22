import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import {  userDataAccess, useResource } from '@spesia/data-access';

type VerificationStatus = 'loading' | 'success' | 'error';

const AccountConfirmation = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [status, setStatus] = useState<VerificationStatus>('loading');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [, { confirmAccount }] = useResource(userDataAccess);
    const [, { resendConfirmationEmail }] = useResource(userDataAccess);


    useEffect(() => {
        const confirm = async () => {
            try {
                const resp = await confirmAccount({
                    token: token,
                    email: email
                });

                if (resp) {
                    setStatus('success');
                    setMessage('Your email has been successfully verified!');
                }
            } catch (error: any) {
                setStatus('error');
                setMessage('Token expired. Please request a new verification email.');
            }
        };

        confirm().then();

    }, []);

    const handleResendEmail = async () => {
        try {
            const resp = await resendConfirmationEmail({
                email: decodeURIComponent(email)
            });
            if (resp) {
                setStatus('success');
                setMessage('A new verification email has been sent. Please check your inbox.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Token expired. Please request a new verification email.');
        }
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#162b3f' }}>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center mx-auto mb-8">
                        <img src="../../assets/logo.png" alt="Logo" />
                    </div>

                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {status === 'loading' && <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />}
                        {status === 'success' && <CheckCircle className="h-8 w-8 text-green-500" />}
                        {status === 'error' && <XCircle className="h-8 w-8 text-red-500" />}
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Email Verification</h1>
                </div>

                {status === 'loading' && (
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">Verifying your email address...</p>
                        <div className="animate-pulse flex justify-center">
                            <div className="h-2 w-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <Alert className="bg-green-50 border-green-200">
                            <AlertDescription className="text-green-800">
                                {message}
                            </AlertDescription>
                        </Alert>
                        <p className="text-gray-600 mb-4">
                            Your account has been activated. You can now sign in to access the platform.
                        </p>
                        <Button
                            className="w-full"
                            onClick={handleGoToLogin}
                        >
                            Go to Login
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <Alert className="bg-red-50 border-red-200">
                            <AlertDescription className="text-red-800">
                                {message}
                            </AlertDescription>
                        </Alert>
                        <p className="text-gray-600 mb-4">
                            Please verify your email address to access the platform. If you haven't received a
                            verification email, you can request a new one.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Button
                                className="w-full"
                                onClick={handleResendEmail}
                            >
                                Reenviar email de confirmação
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={handleGoToLogin}
                            >
                                Back to Login
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountConfirmation;
