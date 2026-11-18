import React from 'react';
import cLang from '../../assets/img/cLang.png';

/**
 * Resolves the primary technology from the tech string or course title.
 */
function detectTech(tech = '', name = '') {
    const combined = `${tech} ${name}`.toLowerCase();
    if (combined.includes('python')) return 'python';
    if (combined.includes('react')) return 'react';
    if (combined.includes('typescript') || combined.includes('ts')) return 'typescript';
    if (combined.includes('javascript') || combined.includes('js')) return 'javascript';
    if (combined.includes('c++') || combined.includes('cpp')) return 'cpp';
    if (combined.includes('java') && !combined.includes('javascript')) return 'java';
    if (combined.includes('sql')) return 'sql';
    if (combined.includes('html')) return 'html';
    if (combined.includes('css')) return 'css';
    if (combined.includes('php')) return 'php';
    if (combined.includes('ruby')) return 'ruby';
    if (combined.includes('go') || combined.includes('golang')) return 'go';
    if (combined.includes('rust')) return 'rust';
    if (combined.match(/\b(r|r-lang)\b/)) return 'r';
    if (combined.match(/\b(c|c-lang)\b/)) return 'c';
    return 'generic';
}

export default function TechIcon({ technology, name, size = 56, className = '' }) {
    const techKey = detectTech(technology, name);

    const containerStyle = {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
        flexShrink: 0
    };

    switch (techKey) {
        case 'python':
            return (
                <div style={{ ...containerStyle, background: 'linear-gradient(135deg, #1f375b 0%, #10223b 100%)' }} className={className} title="Python">
                    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 128 128">
                        <defs>
                            <linearGradient id="pyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#387eb8" />
                                <stop offset="100%" stopColor="#366994" />
                            </linearGradient>
                            <linearGradient id="pyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffe873" />
                                <stop offset="100%" stopColor="#ffd43b" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#pyBlue)" d="M63.3 1.1c-15.6 0-25 7-25 16.3v12.3h25.4v3.6H27.9C12.4 33.3 0 43.8 0 63.8c0 19.9 10.9 30.2 26.5 30.2h7.3v-10.4c0-11.2 9.5-20.9 21.2-20.9h25.1c9.4 0 17.1-8 17.1-17.5V17.4c0-9.3-10-16.3-25.6-16.3h-8.3zm-13.6 9.8c2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7-2.6 0-4.7-2.1-4.7-4.7 0-2.6 2.1-4.7 4.7-4.7z"/>
                        <path fill="url(#pyYellow)" d="M64.7 126.9c15.6 0 25-7 25-16.3V98.3H64.3v-3.6h35.8c15.5 0 27.9-10.5 27.9-30.5 0-19.9-10.9-30.2-26.5-30.2h-7.3v10.4c0 11.2-9.5 20.9-21.2 20.9H47.9c-9.4 0-17.1 8-17.1 17.5v27.8c0 9.3 10 16.3 25.6 16.3h8.3zm13.6-9.8c-2.6 0-4.7-2.1-4.7-4.7 0-2.6 2.1-4.7 4.7-4.7 2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7z"/>
                    </svg>
                </div>
            );

        case 'javascript':
            return (
                <div style={{ ...containerStyle, background: 'linear-gradient(135deg, #F7DF1E 0%, #E6C60D 100%)' }} className={className} title="JavaScript">
                    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 630 630">
                        <rect width="630" height="630" fill="transparent"/>
                        <path d="m363.3 460.9 48.6-28.7c10.8 17.4 22.8 32.2 46.1 32.2 21 0 34.3-8.4 34.3-40.4V216.7h59v208.5c0 62.7-36.9 91.2-89.8 91.2-46.7 0-73.4-24.6-88.2-55.5zm-177.3-6.1 48-31.1c13.2 21.6 30.6 37.8 61.2 37.8 26.4 0 43.2-13.2 43.2-31.8 0-22.2-17.4-30.6-56.4-47.4l-19.2-8.4c-55.8-23.4-92.4-53.4-92.4-116.4 0-58.2 44.4-102.6 114-102.6 49.8 0 85.8 17.4 110.4 60.6l-46.2 29.4c-10.2-18-23.4-25.8-49.8-25.8-24 0-39.6 12.6-39.6 29.4 0 20.4 15 28.2 49.8 43.2l19.2 8.4c67.2 28.8 100.8 58.2 100.8 120.6 0 69-54.6 106.8-124.8 106.8-67.2 0-109.8-33-128-72.7z" fill="#000000"/>
                    </svg>
                </div>
            );

        case 'react':
            return (
                <div style={{ ...containerStyle, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }} className={className} title="React">
                    <svg width={size * 0.75} height={size * 0.75} viewBox="-11.5 -10.23174 23 20.46348">
                        <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
                        <g stroke="#61DAFB" strokeWidth="1" fill="none">
                            <ellipse rx="11" ry="4.2"/>
                            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                        </g>
                    </svg>
                </div>
            );

        case 'typescript':
            return (
                <div style={{ ...containerStyle, background: 'linear-gradient(135deg, #3178C6 0%, #1d528f 100%)' }} className={className} title="TypeScript">
                    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 128 128">
                        <text x="64" y="92" fill="#ffffff" fontFamily="'Poppins', 'Arial Black', sans-serif" fontWeight="900" fontSize="72" textAnchor="middle" letterSpacing="-2">TS</text>
                    </svg>
                </div>
            );

        case 'cpp':
            return (
                <div style={{ ...containerStyle, background: 'linear-gradient(135deg, #00599C 0%, #004477 100%)' }} className={className} title="C++">
                    <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 128 128">
                        <text x="32" y="86" fill="#ffffff" fontFamily="'Poppins', 'Arial Black', sans-serif" fontWeight="900" fontSize="68" textAnchor="middle">C</text>
                        <text x="78" y="76" fill="#ffffff" fontFamily="'Poppins', sans-serif" fontWeight="900" fontSize="48" textAnchor="middle">+</text>
                        <text x="106" y="76" fill="#ffffff" fontFamily="'Poppins', sans-serif" fontWeight="900" fontSize="48" textAnchor="middle">+</text>
                    </svg>
                </div>
            );

        case 'java':
            return (
                <div style={{ ...containerStyle, background: 'linear-gradient(135deg, #1c3d5a 0%, #0f2233 100%)' }} className={className} title="Java">
                    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 128 128">
                        <path fill="#EA2D2E" d="M47.7 93.3s-7.1 4.2 4.9 5.6c14.6 1.7 22.1 1.6 38.3-.9 0 0 5.3 3.3 12.3 6.1-32.9 14.8-74.8-1.5-55.5-10.8z"/>
                        <path fill="#5382A1" d="M41.5 81.3s-8.1 6.1 5.4 7.6c16.5 1.8 28.5 2 50.8-1.2 0 0 3.7 3.8 8.6 5.3-39 12.6-84.3.4-64.8-11.7z"/>
                        <path fill="#EA2D2E" d="M72.2 49.3c5.4 6.2-1.4 11.9-1.4 11.9s13.8-7.1 7.4-16.1c-6-8.5-11.2-12.7-22.7-24.1 3.5 11 11.3 22.1 16.7 28.3z"/>
                        <path fill="#5382A1" d="M96.7 106.6c-19.4 12.2-56.7 9.7-76.3 3.3 0 0-3.6 4.6 3.8 6.4 20.8 5 62.7 5.6 85.3-4.3 0 0-4.6-3.8-12.8-5.4z"/>
                        <path fill="#5382A1" d="M38.8 68.7s-7.4 4.5 4.9 5.8c15.1 1.6 32.2 1.5 50.7-1 0 0 3.5 3.3 7.8 4.4-38.3 10.8-79.6 1.7-63.4-9.2z"/>
                        <path fill="#EA2D2E" d="M89.7 78.4s5.8-4.7 3.9-8.5c-2.1-4.2-10-3.9-14-1.5 0 0 9.8-6.4 19.3 2.1 9.4 8.5-9.2 7.9-9.2 7.9z"/>
                    </svg>
                </div>
            );

        case 'sql':
            return (
                <div style={{ ...containerStyle, background: 'linear-gradient(135deg, #1e4263 0%, #0c2338 100%)' }} className={className} title="SQL">
                    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 128 128">
                        {/* 3-Tier Database Cylinder */}
                        <ellipse cx="64" cy="30" rx="42" ry="14" fill="#38bdf8"/>
                        <path d="M22 30v26c0 7.7 18.8 14 42 14s42-6.3 42-14V30" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round"/>
                        <path d="M22 56v26c0 7.7 18.8 14 42 14s42-6.3 42-14V56" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round"/>
                        <text x="64" y="118" fill="#ffffff" fontFamily="'Poppins', sans-serif" fontWeight="900" fontSize="24" textAnchor="middle" letterSpacing="2">SQL</text>
                    </svg>
                </div>
            );

        case 'r':
            return (
                <div style={{ ...containerStyle, background: 'linear-gradient(135deg, #276DC3 0%, #16467d 100%)' }} className={className} title="R Programming">
                    <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 128 128">
                        <ellipse cx="64" cy="64" rx="48" ry="36" fill="none" stroke="#ffffff" strokeWidth="8"/>
                        <text x="64" y="86" fill="#ffffff" fontFamily="'Poppins', 'Arial Black', sans-serif" fontWeight="900" fontSize="64" textAnchor="middle">R</text>
                    </svg>
                </div>
            );

        case 'c':
            return (
                <div style={containerStyle} className={className} title="C Programming">
                    <img src={cLang} alt="C Programming" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            );

        default:
            return (
                <div style={{ ...containerStyle, background: 'linear-gradient(120deg, #414D8E 18%, #5D74BD 44%, #169BDF 75%)' }} className={className} title={name || 'Course'}>
                    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                    </svg>
                </div>
            );
    }
}
