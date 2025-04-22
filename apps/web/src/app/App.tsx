import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import SignUp from './pages/SignUp.tsx';
import NotAuthorized from './pages/Unauthorized.tsx';
import { AuthGuard } from './guards/AuthGuard.tsx';
import { RoleGuard } from './guards/RoleGuard.tsx';
import { I18nextProvider } from "react-i18next";
import i18n from '../i18n';
import ResetPassword from './pages/ResetPassword.tsx';
import AccountConfirmation from './pages/AccountConfirmation.tsx';
import KafkaMonitor from './pages/KafkaMonitor.tsx';

const queryClient = new QueryClient();

const App = () => {

    return (
    <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter basename="/">
                <Routes>
                    {/* Public Routes */}
                    <Route path="*" element={<NotFound />} />
                    <Route path="/kafka-monitor" element={<KafkaMonitor />} />
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/not-authorized" element={<NotAuthorized />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/change-password" element={<ResetPassword />} />
                    <Route path="/account-confirmation" element={<AccountConfirmation />} />

                    {/* Protected Routes */}
                    <Route element={<AuthGuard />}>
                        <Route path="/home" element={<Home />} />
                    </Route>

                     {/* Role-Protected Routes */}
                     {/*<Route element={<RoleGuard allowedRoles={['admin']} />}>
                          <Route path="/admin" element={<AdminDashboard />} />
                        </Route>*/}

                </Routes>
            </ HashRouter>
        </TooltipProvider>
        </I18nextProvider>
    </QueryClientProvider>
)};

export default App;
