import React from 'react';
import FooterLogo from '../../assets/img/footer-logo.png';
import { FooterProps } from '../../types';
function Footer({ toggleMode }: FooterProps) {
    const isDark = toggleMode === 'dark';

    return (
        <div className="relative w-full">
            {/* Organic Flowing Wave Top Transition */}
            <div className="w-full overflow-hidden leading-none pointer-events-none -mb-1">
                <svg
                    className={`w-full h-6 sm:h-10 ${isDark ? 'text-zinc-900' : 'text-slate-50/90'}`}
                    viewBox="0 0 1200 60"
                    preserveAspectRatio="none"
                    fill="currentColor"
                >
                    <path d="M0,0 C280,45 620,10 920,40 C1060,55 1140,20 1200,15 L1200,60 L0,60 Z" />
                </svg>
            </div>

            <footer className={`pt-6 pb-6 px-4 sm:px-8 transition-colors relative overflow-hidden ${isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-50/90 text-gray-600 border-t border-slate-100'
                }`}>
                {/* Subtle corner wave in footer background */}
                <div className="absolute -bottom-4 -right-4 w-64 h-36 pointer-events-none opacity-20">
                    <svg viewBox="0 0 200 120" fill="none" className="w-full h-full">
                        <path d="M0,120 C50,85 100,100 150,55 C175,32 190,40 200,30 L200,120 Z" fill="#414D8E" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between gap-8 sm:gap-12 mb-8">
                        {/* Brand Info */}
                        <div className="flex flex-col items-start max-w-sm gap-4">
                            <img src={FooterLogo} className="w-36 sm:w-44 object-contain" alt="KodeSkool Logo" />
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                                KodeSkool makes coding fun for school students with interactive curriculums, animated courses, and real-time execution.
                            </p>
                            <div className="flex items-center gap-3 pt-1">
                                {[
                                    { icon: 'fa-x-twitter', link: '#!' },
                                    { icon: 'fa-instagram', link: '#!' },
                                    { icon: 'fa-facebook', link: '#!' },
                                    { icon: 'fa-linkedin', link: 'https://www.linkedin.com/company/kode-skool/posts/?feedView=all' },
                                    { icon: 'fa-youtube', link: '#!' }
                                ].map((s, idx) => (
                                    <a
                                        key={idx}
                                        href={s.link}
                                        target={s.link.startsWith('http') ? '_blank' : '_self'}
                                        rel="noreferrer"
                                        className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-zinc-300 hover:text-brand-blue hover:border-brand-blue hover:shadow transition-all text-sm"
                                    >
                                        <i className={`fa-brands ${s.icon}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-grow max-w-2xl">
                            <div>
                                <h6 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                                    Languages
                                </h6>
                                <ul className="space-y-2 text-xs sm:text-sm">
                                    {['Python', 'JavaScript', 'C++', 'Java', 'SQL', 'TypeScript'].map(lang => (
                                        <li key={lang}>
                                            <a href="#!" className="text-gray-500 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-sky transition-colors">
                                                {lang}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h6 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                                    Legal
                                </h6>
                                <ul className="space-y-2 text-xs sm:text-sm">
                                    <li>
                                        <a href="#!" className="text-gray-500 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-sky transition-colors">
                                            Terms & conditions
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-gray-500 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-sky transition-colors">
                                            Privacy Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                                    Company
                                </h6>
                                <ul className="space-y-2 text-xs sm:text-sm">
                                    <li>
                                        <a href="#features" className="text-gray-500 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-sky transition-colors">
                                            About us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-gray-500 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-sky transition-colors">
                                            Contact us
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 text-center text-xs text-gray-400 dark:text-zinc-500">
                        © {new Date().getFullYear()} KodeSkool. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
