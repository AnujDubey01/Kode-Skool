import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logo from '../Assets/Img/logo.png';
import loginImg from '../Assets/Img/loginImg.png';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, isLoggedIn } = useAuth();

    // Check if user is already logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    // Parse URL tab parameter
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') === 'signup' ? 'signup' : 'signin';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [institution, setInstitution] = useState('school');
    const [role, setRole] = useState('student');
    const [showPass, setShowPass] = useState(false);

    // Form inputs
    const [signinEmail, setSigninEmail] = useState('');
    const [signinPassword, setSigninPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    // Error / status feedback
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Forget password / OTP states
    const [isFlipped, setIsFlipped] = useState(false);
    const [forgetStep, setForgetStep] = useState('email'); // 'email' | 'otp'
    const [forgetEmail, setForgetEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(149);
    const [canResend, setCanResend] = useState(false);
    const otpInputsRef = useRef([]);

    // Reset password modal
    const [showResetModal, setShowResetModal] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passMismatch, setPassMismatch] = useState(false);

    // Navbar collapse on mobile
    const [navExpanded, setNavExpanded] = useState(false);

    useEffect(() => {
        const tab = new URLSearchParams(location.search).get('tab');
        if (tab === 'signup' || tab === 'signin') {
            setActiveTab(tab);
        }
    }, [location.search]);

    // Timer countdown for OTP
    useEffect(() => {
        let interval = null;
        if (isFlipped && forgetStep === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isFlipped, forgetStep, timer]);

    const formatTimer = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleSwitchToSignin = () => {
        setActiveTab('signin');
        setIsFlipped(false);
        setErrorMsg('');
    };

    const handleSwitchToSignup = () => {
        setActiveTab('signup');
        setIsFlipped(false);
        setErrorMsg('');
    };

    const handleSigninSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!signinEmail || !signinPassword) {
            setErrorMsg('Please fill in your email and password.');
            return;
        }

        setLoading(true);
        try {
            const data = await login(signinEmail, signinPassword);
            if (data.success) {
                if (data.userType === 'Admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else if (data.userType === 'Faculty' || data.userType === 'Teacher') {
                    navigate('/teacher/dashboard', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            } else {
                setErrorMsg(data.msg?.msg || data.msg || 'Login failed.');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.msg?.msg || err.response?.data?.msg || err.message || 'Error during login.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!signupEmail || !signupName || !signupPassword) {
            setErrorMsg('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const data = await register(signupEmail, signupPassword, signupName);
            if (data.success) {
                navigate('/dashboard', { replace: true });
            } else {
                setErrorMsg(data.msg?.msg || data.msg || 'Registration failed.');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.msg?.msg || err.response?.data?.msg || err.message || 'Error during registration.');
        } finally {
            setLoading(false);
        }
    };

    const handleShowForgetPassword = () => {
        setIsFlipped(true);
        setForgetStep('email');
        setErrorMsg('');
    };

    const handleSendOTP = (e) => {
        e.preventDefault();
        if (!forgetEmail || !forgetEmail.includes('@')) {
            alert('Enter Valid Email');
            return;
        }
        setForgetStep('otp');
        setTimer(149);
        setCanResend(false);
    };

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5 && otpInputsRef.current[index + 1]) {
            otpInputsRef.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputsRef.current[index - 1]) {
            otpInputsRef.current[index - 1].focus();
        }
    };

    const handleVerifyOTP = (e) => {
        if (e) e.preventDefault();
        const allFilled = otp.every(digit => digit !== '');
        if (!allFilled) {
            alert('Please fill in all OTP fields.');
            return;
        }
        setShowResetModal(true);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (newPass !== confirmPass) {
            setPassMismatch(true);
            return;
        }
        setPassMismatch(false);
        setShowResetModal(false);
        alert('Password reset successful! Please sign in.');
        handleSwitchToSignin();
    };

    const handleResendOTP = () => {
        if (!canResend) return;
        setTimer(149);
        setCanResend(false);
        alert('OTP Resent Successfully');
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'linear-gradient(335deg, rgba(110, 170, 243, 1) 5%, rgba(201, 213, 255, 1) 53%)' }}>
            {/* ── NAVBAR ── */}
            <nav className="absolute top-0 left-0 w-full z-20 px-4 sm:px-8 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/home">
                        <img src={logo} alt="KodeSkool" className="w-28 sm:w-36 object-contain" />
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <Link className="text-brand-darkNavy font-medium hover:text-brand-blue transition-colors text-sm sm:text-base" to="/home#features">
                        About Us
                    </Link>
                    <Link className="text-brand-darkNavy font-medium hover:text-brand-blue transition-colors text-sm sm:text-base" to="/home#skills">
                        Courses
                    </Link>
                </div>
                <button
                    className="md:hidden text-brand-darkNavy text-xl p-2"
                    type="button"
                    onClick={() => setNavExpanded(!navExpanded)}
                    aria-label="Toggle navigation"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
            </nav>

            {/* Mobile Nav Drawer */}
            {navExpanded && (
                <div className="md:hidden absolute top-14 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl z-30 flex flex-col items-center gap-3">
                    <Link className="text-brand-darkNavy font-medium text-base py-1" to="/home#features" onClick={() => setNavExpanded(false)}>
                        About Us
                    </Link>
                    <Link className="text-brand-darkNavy font-medium text-base py-1" to="/home#skills" onClick={() => setNavExpanded(false)}>
                        Courses
                    </Link>
                </div>
            )}

            {/* ── MAIN CONTENT ── */}
            <header className="min-h-screen pt-20 sm:pt-24 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-12">
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left Column — Hero Image */}
                    <div className="hidden md:flex items-center justify-center">
                        <img className="max-w-[85%] object-contain drop-shadow-md animate-fade-in" src={loginImg} alt="KodeSkool Coding" />
                    </div>

                    {/* Right Column — Animated elements + Auth Card */}
                    <div className="relative flex items-center justify-center">
                        {/* Floating decorative elements */}
                        <div
                            className={`hidden sm:flex absolute z-0 items-center justify-center rounded-full transition-all duration-300 ${activeTab === 'signup'
                                    ? 'left-0 top-[6%] -translate-x-[35%] w-24 h-24 sm:w-28 sm:h-28'
                                    : 'left-[78%] top-[6%] translate-x-[25%] w-24 h-24 sm:w-28 sm:h-28'
                                }`}
                            style={{ background: 'linear-gradient(120deg, rgba(64, 77, 141, 1) 15%, rgba(89, 109, 181, 1) 50%, rgba(22, 155, 223, 1) 100%)' }}
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white"></div>
                        </div>

                        <div
                            className={`hidden sm:flex absolute z-0 items-center justify-center rounded-full transition-all duration-300 ${activeTab === 'signup'
                                    ? 'right-0 bottom-[6%] translate-x-[35%] w-24 h-24 sm:w-28 sm:h-28'
                                    : 'right-[78%] bottom-[6%] -translate-x-[25%] w-24 h-24 sm:w-28 sm:h-28'
                                }`}
                            style={{ background: 'linear-gradient(120deg, rgba(64, 77, 141, 1) 15%, rgba(89, 109, 181, 1) 50%, rgba(22, 155, 223, 1) 100%)' }}
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white"></div>
                        </div>

                        {/* Floating Badges */}
                        <div
                            className={`hidden sm:flex absolute z-10 items-center justify-center border-2 border-[#97B8FF] backdrop-blur-md px-4 py-1.5 transition-all duration-300 text-xs sm:text-sm font-semibold text-gray-700/80 ${activeTab === 'signup'
                                    ? '-left-6 bottom-[10%] -translate-y-4 rounded-l-2xl rounded-br-2xl'
                                    : 'left-0 bottom-[78%] -translate-x-6 rounded-t-2xl rounded-bl-2xl'
                                }`}
                            style={{ background: 'linear-gradient(120deg, rgba(92, 127, 255, 0.2) 10%, rgba(103, 79, 255, 0.45) 100%)' }}
                        >
                            <p className="m-0">Courses</p>
                        </div>

                        <div
                            className={`hidden sm:flex absolute z-10 items-center justify-center border-2 border-[#97B8FF] backdrop-blur-md px-4 py-1.5 transition-all duration-300 text-xs sm:text-sm font-semibold text-gray-700/80 ${activeTab === 'signup'
                                    ? '-right-6 top-[10%] translate-y-4 rounded-t-2xl rounded-br-2xl'
                                    : 'right-0 top-[78%] translate-x-6 rounded-r-2xl rounded-bl-2xl'
                                }`}
                            style={{ background: 'linear-gradient(120deg, rgba(92, 127, 255, 0.2) 10%, rgba(103, 79, 255, 0.45) 100%)' }}
                        >
                            <p className="m-0">Test</p>
                        </div>

                        {/* Auth Card Container */}
                        <div
                            className="w-full max-w-md bg-white rounded-2xl shadow-xl py-6 px-6 sm:px-8 z-10 flex flex-col items-center gap-4 transition-transform duration-500"
                            style={{
                                transform: isFlipped ? 'rotateY(180deg)' : 'none',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {!isFlipped ? (
                                <>
                                    {/* Tabs Navigation */}
                                    <div className="inline-flex items-center justify-center p-1 bg-[#F9F9F9] border border-gray-300 rounded-xl max-w-full">
                                        <button
                                            type="button"
                                            onClick={handleSwitchToSignup}
                                            className={`px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeTab === 'signup'
                                                    ? 'text-white shadow-sm font-semibold'
                                                    : 'text-gray-500 hover:text-gray-800'
                                                }`}
                                            style={activeTab === 'signup' ? { background: 'linear-gradient(120deg, rgba(64, 77, 141, 1) 15%, rgba(89, 109, 181, 1) 50%, rgba(22, 155, 223, 1) 100%)' } : {}}
                                        >
                                            Sign Up
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSwitchToSignin}
                                            className={`px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeTab === 'signin'
                                                    ? 'text-white shadow-sm font-semibold'
                                                    : 'text-gray-500 hover:text-gray-800'
                                                }`}
                                            style={activeTab === 'signin' ? { background: 'linear-gradient(120deg, rgba(64, 77, 141, 1) 15%, rgba(89, 109, 181, 1) 50%, rgba(22, 155, 223, 1) 100%)' } : {}}
                                        >
                                            Sign In
                                        </button>
                                    </div>

                                    {/* Role & Institution Selector */}
                                    <div className="w-full text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-200/80">
                                        <div className="flex justify-center gap-6">
                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="institution"
                                                    value="school"
                                                    checked={institution === 'school'}
                                                    onChange={() => setInstitution('school')}
                                                    className="accent-[#404D8D]"
                                                />
                                                <span>School</span>
                                            </label>
                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="institution"
                                                    value="college"
                                                    checked={institution === 'college'}
                                                    onChange={() => setInstitution('college')}
                                                    className="accent-[#404D8D]"
                                                />
                                                <span>College</span>
                                            </label>
                                        </div>
                                        <hr className="my-2 border-gray-200" />
                                        <div className="flex justify-center gap-6">
                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="faculty"
                                                    checked={role === 'faculty'}
                                                    onChange={() => setRole('faculty')}
                                                    className="accent-[#404D8D]"
                                                />
                                                <span>Faculty</span>
                                            </label>
                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="student"
                                                    checked={role === 'student'}
                                                    onChange={() => setRole('student')}
                                                    className="accent-[#404D8D]"
                                                />
                                                <span>Student</span>
                                            </label>
                                        </div>
                                    </div>

                                    {errorMsg && (
                                        <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs py-2 px-3 rounded-lg text-center">
                                            {errorMsg}
                                        </div>
                                    )}

                                    {/* Forms */}
                                    <div className="w-full">
                                        {activeTab === 'signin' ? (
                                            <form onSubmit={handleSigninSubmit} className="flex flex-col gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="signinEmail">
                                                        Email ID
                                                    </label>
                                                    <input
                                                        id="signinEmail"
                                                        className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 outline-none focus:border-[#5D74BD] focus:ring-2 focus:ring-[#5D74BD]/20 transition-all"
                                                        type="email"
                                                        value={signinEmail}
                                                        onChange={(e) => setSigninEmail(e.target.value)}
                                                        placeholder="Enter Email Id..."
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="signinPassword">
                                                        Password
                                                    </label>
                                                    <div className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl flex items-center justify-between focus-within:border-[#5D74BD] focus-within:ring-2 focus-within:ring-[#5D74BD]/20 transition-all">
                                                        <input
                                                            id="signinPassword"
                                                            type={showPass ? 'text' : 'password'}
                                                            value={signinPassword}
                                                            onChange={(e) => setSigninPassword(e.target.value)}
                                                            placeholder="Enter Password..."
                                                            required
                                                            className="w-[88%] bg-transparent border-none outline-none text-sm text-gray-800"
                                                        />
                                                        <span onClick={() => setShowPass(!showPass)} className="cursor-pointer text-gray-500 hover:text-gray-700">
                                                            <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <span
                                                        onClick={handleShowForgetPassword}
                                                        className="text-xs font-medium cursor-pointer bg-gradient-to-r from-[#404D8D] to-[#169BDF] bg-clip-text text-transparent hover:underline"
                                                    >
                                                        Forgot Password?
                                                    </span>
                                                </div>

                                                <button
                                                    className="w-full h-11 mt-1 rounded-full font-medium text-sm text-white tracking-wide bg-gradient-to-r from-[#404D8D] via-[#596DB5] to-[#169BDF] hover:opacity-95 shadow-md active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
                                                    type="submit"
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Signing In...' : 'Sign In'}
                                                </button>

                                                <p className="text-xs text-center text-gray-600 mt-2">
                                                    Don't have an account?{' '}
                                                    <span
                                                        className="font-semibold cursor-pointer bg-gradient-to-r from-[#404D8D] to-[#169BDF] bg-clip-text text-transparent hover:underline"
                                                        onClick={handleSwitchToSignup}
                                                    >
                                                        Sign Up
                                                    </span>
                                                </p>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="email">
                                                        Email ID
                                                    </label>
                                                    <input
                                                        id="email"
                                                        className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 outline-none focus:border-[#5D74BD] focus:ring-2 focus:ring-[#5D74BD]/20 transition-all"
                                                        type="email"
                                                        value={signupEmail}
                                                        onChange={(e) => setSignupEmail(e.target.value)}
                                                        placeholder="Enter Email Id..."
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="newUsername">
                                                        User Name
                                                    </label>
                                                    <input
                                                        id="newUsername"
                                                        className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 outline-none focus:border-[#5D74BD] focus:ring-2 focus:ring-[#5D74BD]/20 transition-all"
                                                        type="text"
                                                        value={signupName}
                                                        onChange={(e) => setSignupName(e.target.value)}
                                                        placeholder="Enter Your Name..."
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="signupPassword">
                                                        Password
                                                    </label>
                                                    <div className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl flex items-center justify-between focus-within:border-[#5D74BD] focus-within:ring-2 focus-within:ring-[#5D74BD]/20 transition-all">
                                                        <input
                                                            id="signupPassword"
                                                            type={showPass ? 'text' : 'password'}
                                                            value={signupPassword}
                                                            onChange={(e) => setSignupPassword(e.target.value)}
                                                            placeholder="Enter Password..."
                                                            required
                                                            className="w-[88%] bg-transparent border-none outline-none text-sm text-gray-800"
                                                        />
                                                        <span onClick={() => setShowPass(!showPass)} className="cursor-pointer text-gray-500 hover:text-gray-700">
                                                            <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    className="w-full h-11 mt-1 rounded-full font-medium text-sm text-white tracking-wide bg-gradient-to-r from-[#404D8D] via-[#596DB5] to-[#169BDF] hover:opacity-95 shadow-md active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
                                                    type="submit"
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Registering...' : 'Register'}
                                                </button>

                                                <p className="text-xs text-center text-gray-600 mt-2">
                                                    Already have an account?{' '}
                                                    <span
                                                        className="font-semibold cursor-pointer bg-gradient-to-r from-[#404D8D] to-[#169BDF] bg-clip-text text-transparent hover:underline"
                                                        onClick={handleSwitchToSignin}
                                                    >
                                                        Sign In
                                                    </span>
                                                </p>
                                            </form>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Flipped Forget Password Screen */
                                <div
                                    className="w-full flex flex-col items-center justify-center py-4"
                                    style={{ transform: 'rotateY(180deg)' }}
                                >
                                    {forgetStep === 'email' ? (
                                        <div className="w-full text-center flex flex-col items-center gap-3">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Forgot Password</h2>
                                            <p className="text-xs text-gray-500">Enter your registered email to receive an OTP.</p>
                                            <form onSubmit={handleSendOTP} className="w-full flex flex-col gap-3 mt-2">
                                                <div className="text-left">
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="forget-email">Email</label>
                                                    <input
                                                        id="forget-email"
                                                        className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 outline-none focus:border-[#5D74BD] focus:ring-2 focus:ring-[#5D74BD]/20 transition-all"
                                                        type="email"
                                                        value={forgetEmail}
                                                        onChange={(e) => setForgetEmail(e.target.value)}
                                                        placeholder="Enter Email Id..."
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    className="w-full h-11 rounded-full font-medium text-sm text-white bg-gradient-to-r from-[#404D8D] via-[#596DB5] to-[#169BDF] hover:opacity-95 shadow-md transition-all cursor-pointer"
                                                    type="submit"
                                                >
                                                    Send OTP
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer mt-1"
                                                    onClick={() => setIsFlipped(false)}
                                                >
                                                    Back to Login
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="w-full text-center flex flex-col items-center gap-3">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">OTP Verification</h3>
                                            <p className="text-xs text-gray-500">
                                                Enter the 6-digit code sent to <span className="font-semibold text-gray-700">{forgetEmail}</span>
                                            </p>
                                            <p className="text-sm font-bold bg-gradient-to-r from-[#404D8D] via-[#596DB5] to-[#169BDF] bg-clip-text text-transparent">
                                                {canResend ? 'You Can Resend OTP!' : formatTimer(timer)}
                                            </p>
                                            <div className="flex justify-center gap-2 my-2">
                                                {otp.map((digit, idx) => (
                                                    <input
                                                        key={idx}
                                                        ref={el => (otpInputsRef.current[idx] = el)}
                                                        className="w-9 h-11 sm:w-11 sm:h-12 text-center text-lg font-bold bg-white border-2 border-gray-300 focus:border-[#5D74BD] rounded-xl outline-none shadow-sm transition-all"
                                                        type="text"
                                                        maxLength="1"
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Didn't receive any code?{' '}
                                                <span
                                                    className={`font-semibold cursor-pointer ${canResend
                                                            ? 'bg-gradient-to-r from-[#404D8D] to-[#169BDF] bg-clip-text text-transparent underline'
                                                            : 'text-gray-400 pointer-events-none'
                                                        }`}
                                                    onClick={handleResendOTP}
                                                >
                                                    Resend
                                                </span>
                                            </p>
                                            <button
                                                className="w-full h-11 rounded-full font-medium text-sm text-white bg-gradient-to-r from-[#404D8D] via-[#596DB5] to-[#169BDF] hover:opacity-95 shadow-md transition-all cursor-pointer mt-1"
                                                type="button"
                                                onClick={handleVerifyOTP}
                                            >
                                                Verify OTP
                                            </button>
                                            <button
                                                type="button"
                                                className="text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer"
                                                onClick={() => setIsFlipped(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── PASSWORD RESET MODAL ── */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-fade-in flex flex-col items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800">Create New Password</h3>
                        <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-3 mt-1">
                            <div className="text-left">
                                <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="newPass">New Password</label>
                                <input
                                    id="newPass"
                                    className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 outline-none focus:border-[#5D74BD] focus:ring-2 focus:ring-[#5D74BD]/20 transition-all"
                                    type="password"
                                    value={newPass}
                                    onChange={(e) => setNewPass(e.target.value)}
                                    placeholder="Enter Password..."
                                    required
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="confirmPass">Confirm Password</label>
                                <input
                                    id="confirmPass"
                                    className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 outline-none focus:border-[#5D74BD] focus:ring-2 focus:ring-[#5D74BD]/20 transition-all"
                                    type="password"
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    placeholder="Enter Confirm Password..."
                                    required
                                />
                            </div>
                            {passMismatch && (
                                <div className="text-xs text-red-500 text-center font-medium">
                                    Passwords do not match
                                </div>
                            )}
                            <button
                                className="w-full h-11 mt-1 rounded-full font-medium text-sm text-white bg-gradient-to-r from-[#404D8D] via-[#596DB5] to-[#169BDF] hover:opacity-95 shadow-md transition-all cursor-pointer"
                                type="submit"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
