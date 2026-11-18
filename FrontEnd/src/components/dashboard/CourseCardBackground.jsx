import React from 'react';

function getTechType(title = '') {
    const t = title.toLowerCase();
    if (t.includes('python')) return 'python';
    if (t.includes('typescript')) return 'typescript';
    if (t.includes('javascript') || t.includes('js')) return 'javascript';
    if (t.includes('react')) return 'react';
    if (t.includes('sql')) return 'sql';
    if (t.includes('c++') || t.includes('cpp')) return 'cpp';
    if (t.includes('c programming') || t.match(/\bc\b/)) return 'c';
    if (t.includes('java')) return 'java';
    if (t.match(/\b(r|r-lang)\b/)) return 'r';
    return 'default';
}

export default function CourseCardBackground({ title = '', technology = '' }) {
    const tech = getTechType(`${title} ${technology}`);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', borderRadius: '16px', pointerEvents: 'none' }}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 340 200"
                preserveAspectRatio="xMidYMid slice"
                style={{ width: '100%', height: '100%', display: 'block' }}
            >
                <defs>
                    {/* Bottom Dark Gradient to keep title/resume/progress 100% legible */}
                    <linearGradient id="darkFade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(0, 0, 0, 0.05)" />
                        <stop offset="50%" stopColor="rgba(10, 14, 22, 0.65)" />
                        <stop offset="100%" stopColor="rgba(8, 10, 16, 0.98)" />
                    </linearGradient>

                    {/* Branding Pill Glow */}
                    <linearGradient id="brandPillGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#414D8E" />
                        <stop offset="50%" stopColor="#5D74BD" />
                        <stop offset="100%" stopColor="#169BDF" />
                    </linearGradient>

                    {/* Python Gradients */}
                    <linearGradient id="pyBg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0c1726" />
                        <stop offset="50%" stopColor="#13233a" />
                        <stop offset="100%" stopColor="#0a121e" />
                    </linearGradient>
                    <linearGradient id="pyBlue" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#387eb8" />
                        <stop offset="100%" stopColor="#2c5b84" />
                    </linearGradient>
                    <linearGradient id="pyYellow" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffe873" />
                        <stop offset="100%" stopColor="#ffd43b" />
                    </linearGradient>

                    {/* JavaScript Gradients */}
                    <linearGradient id="jsBg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#171714" />
                        <stop offset="50%" stopColor="#252212" />
                        <stop offset="100%" stopColor="#0c0b08" />
                    </linearGradient>

                    {/* C & C++ Gradients */}
                    <linearGradient id="cBg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0d1424" />
                        <stop offset="50%" stopColor="#15223c" />
                        <stop offset="100%" stopColor="#080e1a" />
                    </linearGradient>

                    {/* SQL Gradients */}
                    <linearGradient id="sqlBg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0a1a29" />
                        <stop offset="50%" stopColor="#112d45" />
                        <stop offset="100%" stopColor="#07131e" />
                    </linearGradient>

                    {/* React Gradients */}
                    <linearGradient id="reactBg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="50%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0a0f1d" />
                    </linearGradient>

                    {/* Java Gradients */}
                    <linearGradient id="javaBg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1c1917" />
                        <stop offset="50%" stopColor="#292524" />
                        <stop offset="100%" stopColor="#0c0a09" />
                    </linearGradient>
                </defs>

                {/* 1. Language-Specific Artwork & Ambience */}

                {/* PYTHON */}
                {tech === 'python' && (
                    <g>
                        <rect width="340" height="200" fill="url(#pyBg)" />
                        <circle cx="290" cy="50" r="75" fill="#387eb8" opacity="0.22" filter="blur(25px)" />
                        <circle cx="230" cy="95" r="50" fill="#ffd43b" opacity="0.14" filter="blur(25px)" />
                        <g opacity="0.28" fill="#e2e8f0" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">import numpy as np</text>
                            <text x="18" y="86">def solve(matrix):</text>
                            <text x="34" y="102">return [x**2 for x in matrix]</text>
                        </g>
                        <g transform="translate(240, 20) scale(0.65)" opacity="0.45">
                            <path fill="url(#pyBlue)" d="M63.3 1.1c-15.6 0-25 7-25 16.3v12.3h25.4v3.6H27.9C12.4 33.3 0 43.8 0 63.8c0 19.9 10.9 30.2 26.5 30.2h7.3v-10.4c0-11.2 9.5-20.9 21.2-20.9h25.1c9.4 0 17.1-8 17.1-17.5V17.4c0-9.3-10-16.3-25.6-16.3h-8.3zm-13.6 9.8c2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7-2.6 0-4.7-2.1-4.7-4.7 0-2.6 2.1-4.7 4.7-4.7z"/>
                            <path fill="url(#pyYellow)" d="M64.7 126.9c15.6 0 25-7 25-16.3V98.3H64.3v-3.6h35.8c15.5 0 27.9-10.5 27.9-30.5 0-19.9-10.9-30.2-26.5-30.2h-7.3v10.4c0 11.2-9.5 20.9-21.2 20.9H47.9c-9.4 0-17.1 8-17.1 17.5v27.8c0 9.3 10 16.3 25.6 16.3h8.3zm13.6-9.8c-2.6 0-4.7-2.1-4.7-4.7 0-2.6 2.1-4.7 4.7-4.7 2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7z"/>
                        </g>
                    </g>
                )}

                {/* JAVASCRIPT */}
                {tech === 'javascript' && (
                    <g>
                        <rect width="340" height="200" fill="url(#jsBg)" />
                        <circle cx="280" cy="50" r="80" fill="#f59e0b" opacity="0.25" filter="blur(30px)" />
                        <circle cx="220" cy="90" r="50" fill="#ffd43b" opacity="0.15" filter="blur(20px)" />
                        <g opacity="0.32" fill="#fef08a" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">const sum = (a, b) =&gt; a + b;</text>
                            <text x="18" y="86">document.addEventListener('load', init);</text>
                            <text x="18" y="102">console.log("Kode-Skool JS");</text>
                        </g>
                        {/* Iconic JS Emblem Watermark */}
                        <g transform="translate(245, 18) scale(0.65)" opacity="0.6">
                            <rect width="100" height="100" rx="16" fill="#F7DF1E"/>
                            <text x="68" y="80" fill="#000000" fontFamily="'Poppins', 'Arial Black', sans-serif" fontWeight="900" fontSize="56" textAnchor="middle">JS</text>
                        </g>
                    </g>
                )}

                {/* TYPESCRIPT */}
                {tech === 'typescript' && (
                    <g>
                        <rect width="340" height="200" fill="url(#cBg)" />
                        <circle cx="280" cy="50" r="75" fill="#3178C6" opacity="0.3" filter="blur(25px)" />
                        <g opacity="0.3" fill="#93c5fd" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">interface Course &lt;T&gt; &#123;</text>
                            <text x="18" y="86">  id: string; title: T;</text>
                            <text x="18" y="102">&#125;</text>
                        </g>
                        <g transform="translate(245, 18) scale(0.65)" opacity="0.6">
                            <rect width="100" height="100" rx="16" fill="#3178C6"/>
                            <text x="68" y="80" fill="#ffffff" fontFamily="'Poppins', 'Arial Black', sans-serif" fontWeight="900" fontSize="56" textAnchor="middle">TS</text>
                        </g>
                    </g>
                )}

                {/* C PROGRAMMING */}
                {tech === 'c' && (
                    <g>
                        <rect width="340" height="200" fill="url(#cBg)" />
                        <circle cx="280" cy="55" r="80" fill="#3b82f6" opacity="0.25" filter="blur(30px)" />
                        <circle cx="170" cy="40" r="45" fill="#60a5fa" opacity="0.12" filter="blur(20px)" />
                        <g opacity="0.28" fill="#93c5fd" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">#include &lt;stdio.h&gt;</text>
                            <text x="18" y="86">int *ptr = &amp;array[0];</text>
                            <text x="18" y="102">printf("%p: %d\n", ptr, *ptr);</text>
                        </g>
                        <g transform="translate(245, 18)" opacity="0.38">
                            <circle cx="45" cy="45" r="40" fill="none" stroke="#60a5fa" strokeWidth="5" strokeDasharray="210 50" />
                            <text x="45" y="62" fill="#ffffff" fontFamily="'Poppins', sans-serif" fontWeight="900" fontSize="52" textAnchor="middle">C</text>
                        </g>
                    </g>
                )}

                {/* C++ */}
                {tech === 'cpp' && (
                    <g>
                        <rect width="340" height="200" fill="url(#cBg)" />
                        <circle cx="280" cy="55" r="80" fill="#00599c" opacity="0.35" filter="blur(30px)" />
                        <g opacity="0.28" fill="#93c5fd" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">#include &lt;iostream&gt;</text>
                            <text x="18" y="86">std::vector&lt;int&gt; vec;</text>
                            <text x="18" y="102">vec.push_back(42);</text>
                        </g>
                        <g transform="translate(230, 20)" opacity="0.4">
                            <text x="40" y="65" fill="#ffffff" fontFamily="'Poppins', sans-serif" fontWeight="900" fontSize="56" textAnchor="middle">C++</text>
                        </g>
                    </g>
                )}

                {/* SQL */}
                {tech === 'sql' && (
                    <g>
                        <rect width="340" height="200" fill="url(#sqlBg)" />
                        <circle cx="270" cy="50" r="75" fill="#0284c7" opacity="0.25" filter="blur(25px)" />
                        <circle cx="220" cy="90" r="50" fill="#38bdf8" opacity="0.15" filter="blur(25px)" />
                        <g opacity="0.3" fill="#bae6fd" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">SELECT student_id, score</text>
                            <text x="18" y="86">FROM test_results</text>
                            <text x="18" y="102">WHERE course = 'SQL' ORDER BY score DESC;</text>
                        </g>
                        <g transform="translate(250, 18) scale(0.6)" opacity="0.45">
                            <ellipse cx="64" cy="24" rx="42" ry="14" fill="#38bdf8"/>
                            <path d="M22 24v24c0 7.7 18.8 14 42 14s42-6.3 42-14V24" fill="none" stroke="#38bdf8" strokeWidth="6"/>
                            <path d="M22 48v24c0 7.7 18.8 14 42 14s42-6.3 42-14V48" fill="none" stroke="#38bdf8" strokeWidth="6"/>
                            <path d="M22 72v24c0 7.7 18.8 14 42 14s42-6.3 42-14V72" fill="none" stroke="#38bdf8" strokeWidth="6"/>
                        </g>
                    </g>
                )}

                {/* REACT */}
                {tech === 'react' && (
                    <g>
                        <rect width="340" height="200" fill="url(#reactBg)" />
                        <circle cx="270" cy="50" r="75" fill="#0891b2" opacity="0.25" filter="blur(25px)" />
                        <g opacity="0.28" fill="#a5f3fc" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">const [state, setState] = useState();</text>
                            <text x="18" y="86">&lt;KodeSkool.Course /&gt;</text>
                        </g>
                        <g transform="translate(255, 30) scale(2.8)" opacity="0.45">
                            <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
                            <g stroke="#61DAFB" strokeWidth="1" fill="none">
                                <ellipse rx="11" ry="4.2"/>
                                <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                                <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                            </g>
                        </g>
                    </g>
                )}

                {/* JAVA */}
                {tech === 'java' && (
                    <g>
                        <rect width="340" height="200" fill="url(#javaBg)" />
                        <circle cx="270" cy="50" r="75" fill="#ea580c" opacity="0.2" filter="blur(25px)" />
                        <g opacity="0.28" fill="#fed7aa" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">public class Course &#123;</text>
                            <text x="30" y="86">public static void main() &#123;&#125;</text>
                        </g>
                        <g transform="translate(245, 18) scale(0.6)" opacity="0.45">
                            <path fill="#EA2D2E" d="M47.7 93.3s-7.1 4.2 4.9 5.6c14.6 1.7 22.1 1.6 38.3-.9 0 0 5.3 3.3 12.3 6.1-32.9 14.8-74.8-1.5-55.5-10.8z"/>
                            <path fill="#5382A1" d="M41.5 81.3s-8.1 6.1 5.4 7.6c16.5 1.8 28.5 2 50.8-1.2 0 0 3.7 3.8 8.6 5.3-39 12.6-84.3.4-64.8-11.7z"/>
                            <path fill="#EA2D2E" d="M72.2 49.3c5.4 6.2-1.4 11.9-1.4 11.9s13.8-7.1 7.4-16.1c-6-8.5-11.2-12.7-22.7-24.1 3.5 11 11.3 22.1 16.7 28.3z"/>
                        </g>
                    </g>
                )}

                {/* R */}
                {tech === 'r' && (
                    <g>
                        <rect width="340" height="200" fill="url(#sqlBg)" />
                        <circle cx="270" cy="50" r="75" fill="#276DC3" opacity="0.3" filter="blur(25px)" />
                        <g opacity="0.3" fill="#bae6fd" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">data &lt;- read.csv("stats.csv")</text>
                            <text x="18" y="86">summary(data)</text>
                        </g>
                        <g transform="translate(240, 20) scale(0.65)" opacity="0.5">
                            <ellipse cx="64" cy="64" rx="52" ry="38" fill="none" stroke="#276DC3" strokeWidth="9"/>
                            <text x="64" y="88" fill="#ffffff" fontFamily="'Poppins', 'Arial Black', sans-serif" fontWeight="900" fontSize="64" textAnchor="middle">R</text>
                        </g>
                    </g>
                )}

                {/* DEFAULT */}
                {tech === 'default' && (
                    <g>
                        <rect width="340" height="200" fill="url(#pyBg)" />
                        <circle cx="270" cy="50" r="75" fill="#4f46e5" opacity="0.25" filter="blur(25px)" />
                        <g opacity="0.28" fill="#e0e7ff" fontFamily="Consolas, 'Courier New', monospace" fontSize="10">
                            <text x="18" y="70">&lt;KodeSkool.InteractiveCode /&gt;</text>
                            <text x="18" y="86">learn.practice.master();</text>
                        </g>
                    </g>
                )}

                {/* 2. Top-Left Kode-Skool Official Brand Pill */}
                <g transform="translate(18, 16)">
                    <rect
                        x="0"
                        y="0"
                        width="116"
                        height="26"
                        rx="13"
                        fill="rgba(15, 23, 42, 0.75)"
                        stroke="rgba(255, 255, 255, 0.22)"
                        strokeWidth="1"
                    />
                    <circle cx="14" cy="13" r="5" fill="url(#brandPillGrad)" />
                    <text
                        x="14"
                        y="15.5"
                        fill="#ffffff"
                        fontFamily="'Poppins', sans-serif"
                        fontWeight="900"
                        fontSize="7"
                        textAnchor="middle"
                    >
                        K
                    </text>
                    <text
                        x="27"
                        y="17"
                        fill="#FFFFFF"
                        fontFamily="'Poppins', sans-serif"
                        fontWeight="700"
                        fontSize="11"
                        letterSpacing="0.4"
                    >
                        Kode-Skool
                    </text>
                </g>

                {/* 3. Dark Bottom Fade Overlay */}
                <rect width="340" height="200" fill="url(#darkFade)" />
            </svg>
        </div>
    );
}
