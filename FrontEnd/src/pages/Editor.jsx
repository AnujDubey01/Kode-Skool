import React, { useEffect, useState, useRef } from 'react';
import compilerService from '../services/compilerService';

const languages = {
    C: `#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    "C++": `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    Py: `print("Hello, World!")`,
    SQL: `SELECT 'Hello, World!' AS greeting;`,
    Swift: `import Swift\nprint("Hello, World!")`,
    JS: `console.log("Hello, World!");`,
    R: `print("Hello, World!")`,
    Ruby: `puts "Hello, World!"`,
    Rust: `fn main() {\n    println!("Hello, World!");\n}`
};

function Editor(props) {
    const [currentLanguage, setCurrentLanguage] = useState("C");
    const [code, setCode] = useState(languages["C"]);
    const [output, setOutput] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionStats, setExecutionStats] = useState(null);
    const [stdin, setStdin] = useState("");
    const [showStdin, setShowStdin] = useState(false);
    const [fullEditor, setFullEditor] = useState(false);
    const [mobileTab, setMobileTab] = useState('code'); // 'code' | 'output'
    const [saved, setSaved] = useState(false);
    const textareaRef = useRef(null);

    const handleInputChange = (e) => {
        setCode(e.target.value);
    };

    const handleSaveCode = () => {
        try {
            const langMap = {
                C: 'c',
                'C++': 'cpp',
                Java: 'java',
                Py: 'py',
                SQL: 'sql',
                Swift: 'swift',
                JS: 'js',
                R: 'r',
                Ruby: 'rb',
                Rust: 'rs'
            };
            const langKey = langMap[currentLanguage] || 'code';
            const fileName = `kode-skool-${langKey}.txt`;

            const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Failed to download file:', error);
        }
    };

    const switchLanguage = (language) => {
        setCurrentLanguage(language);
        setCode(languages[language]);
        setOutput("");
        setExecutionStats(null);
    };

    const runCode = async () => {
        if (!code || !code.trim()) {
            setOutput("Error: Cannot execute empty code.");
            return;
        }

        setIsExecuting(true);
        setOutput("⏳ Compiling and executing code...");
        setExecutionStats(null);
        if (window.innerWidth < 866) setMobileTab('output');

        try {
            const res = await compilerService.executeCode({
                language: currentLanguage,
                script: code,
                stdin: stdin
            });

            if (res.success) {
                const outputText = res.output || res.error || "(Program executed successfully with no output)";
                setOutput(outputText);
                setExecutionStats({
                    cpuTime: res.cpuTime,
                    memory: res.memory,
                    statusCode: res.statusCode
                });
            } else {
                setOutput(`Execution Error:\n${res.message || res.error || "Failed to execute"}`);
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || "Failed to connect to compiler service.";
            setOutput(`Error: ${errMsg}\nPlease verify that your backend server is running.`);
        } finally {
            setIsExecuting(false);
        }
    };

    const clearOutput = () => {
        setOutput("");
        setExecutionStats(null);
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const fullScreen = () => {
        if (props.dashboardNav?.current) {
            props.dashboardNav.current.classList.toggle('full-screen');
            setFullEditor(props.dashboardNav.current.classList.contains('full-screen'));
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [code]);

    const getLineNumbers = () => {
        const lines = code.split("\n").length;
        return Array.from({ length: lines }, (_, i) => i + 1).join("\n");
    };

    const handleKeyDown = (e) => {
        const { selectionStart, selectionEnd } = e.target;
        const value = e.target.value;

        if (e.key === "Tab") {
            e.preventDefault();
            const updatedCode =
                value.substring(0, selectionStart) +
                "    " +
                value.substring(selectionEnd);
            setCode(updatedCode);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 4;
                }
            }, 0);
        }

        if (e.key === "Enter") {
            e.preventDefault();
            const currentLine = value.substring(0, selectionStart).split("\n").pop();
            const indentation = currentLine.match(/^\s*/)[0] || "";

            const updatedCode =
                value.substring(0, selectionStart) +
                "\n" +
                indentation +
                value.substring(selectionEnd);
            setCode(updatedCode);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + indentation.length + 1;
                }
            }, 0);
        }

        const brackets = {
            "(": ")",
            "[": "]",
            "{": "}",
            '"': '"',
            "'": "'",
        };
        if (brackets[e.key]) {
            e.preventDefault();
            const closingBracket = brackets[e.key];
            const updatedCode =
                value.substring(0, selectionStart) +
                e.key +
                closingBracket +
                value.substring(selectionEnd);
            setCode(updatedCode);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 1;
                }
            }, 0);
        }
    };

    const welcome = useRef(null);
    const search = useRef(null);

    const handleClickOutside = (event) => {
        if (search.current?.parentElement && !search.current.parentElement.contains(event.target)) {
            welcome.current?.classList.remove('openSearch');
            search.current?.classList.remove('openSearch');
            document.removeEventListener('mousedown', handleClickOutside);
        }
    };

    const openSearchOpt = () => {
        welcome.current?.classList.add('openSearch');
        search.current?.classList.add('openSearch');
        document.addEventListener('mousedown', handleClickOutside);
    };

    const userName = props.user?.name || localStorage.getItem('user_name') || 'Student';

    return (
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-6 font-poppins bg-[#f8fafc] dark:bg-zinc-950 min-h-screen flex flex-col justify-between relative overflow-hidden">
            {/* Ambient background decorative glow (subtle, no dotmatrix) */}
            <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-100/25 dark:bg-indigo-900/10 blur-3xl pointer-events-none"></div>

            {/* Consistent Top Navigation Bar (Matches Dashboard, Courses, Profile) */}
            <div className="flex flex-row justify-between items-center w-full mb-4 shrink-0 relative z-10">
                {/* Left: Hamburger + Greeting + Badge */}
                <div className="flex flex-row items-center gap-3">
                    <button
                        type="button"
                        className="cursor-pointer text-slate-700 dark:text-gray-200 p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors border-none bg-transparent"
                        onClick={props.controlNav}
                        title="Toggle Navigation"
                    >
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>
                    <div ref={welcome} className="flex flex-col">
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white m-0">
                                Welcome, <span className="font-extrabold text-slate-900 dark:text-white">{userName}!</span>
                            </h1>
                            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200/80 dark:border-blue-700/50 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                Code Playground
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 m-0 font-medium">
                            Let's crack the code
                        </p>
                    </div>
                </div>

                {/* Right: Search Pill + Notification Bell + User Avatar */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 text-xs shadow-sm hover:border-blue-400 transition-all">
                        <i className="fa-solid fa-magnifying-glass text-slate-400 mr-2 cursor-pointer text-xs" onClick={openSearchOpt}></i>
                        <input
                            ref={search}
                            type="text"
                            name="search"
                            id="search"
                            className="bg-transparent outline-none w-24 sm:w-36 text-xs text-slate-800 dark:text-gray-100 placeholder-slate-400"
                            placeholder="Search playground..."
                        />
                    </div>

                    <div className="relative cursor-pointer w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-blue-600 hover:border-blue-400 shadow-sm transition-all text-sm">
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            5
                        </span>
                        <i className="fa-solid fa-bell"></i>
                    </div>

                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm cursor-pointer select-none">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Desktop / Responsive IDE Frame */}
            <div className="flex-grow flex flex-row rounded-2xl shadow-sm border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden relative min-h-[calc(100vh-140px)] z-10">
                {/* Language Controller Sidebar */}
                <div className="w-14 sm:w-16 shrink-0 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center py-2 gap-2">
                    <div
                        onClick={fullScreen}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-300 transition-colors"
                        title="Toggle full screen"
                    >
                        {fullEditor ? <i className="fa-solid fa-bars"></i> : <i className="fa-solid fa-expand"></i>}
                    </div>
                    <div className="flex-grow overflow-y-auto no-scrollbar flex flex-col gap-2 py-1 items-center w-full">
                        {Object.keys(languages).map((language) => (
                            <button
                                key={language}
                                type="button"
                                onClick={() => switchLanguage(language)}
                                className={`w-10 h-10 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                    currentLanguage === language
                                        ? 'bg-gradient-to-r from-[#414D8E] to-[#169BDF] text-white shadow-sm'
                                        : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700'
                                }`}
                            >
                                {language}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor & Output Split Panels */}
                <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-white dark:bg-zinc-950">
                    {/* Code Section */}
                    <div className={`flex flex-col flex-grow md:w-3/5 border-r border-gray-200 dark:border-zinc-800 ${
                        window.innerWidth <= 867 && mobileTab === 'output' ? 'hidden' : 'flex'
                    }`}>
                        {/* Editor Header Bar */}
                        <div className="h-12 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-1">
                                <div className="px-3 py-1 bg-white dark:bg-zinc-800 border-t border-l border-r border-gray-200 dark:border-zinc-700 rounded-t-lg text-xs font-semibold text-gray-800 dark:text-gray-100 shadow-sm flex items-center gap-2">
                                    <span>Main.{currentLanguage === 'Py' ? 'py' : currentLanguage === 'Java' ? 'java' : currentLanguage === 'JS' ? 'js' : 'c'}</span>
                                </div>
                                <button type="button" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1 text-sm font-bold">
                                    +
                                </button>
                                {window.innerWidth <= 867 && (
                                    <button
                                        type="button"
                                        onClick={() => setMobileTab('output')}
                                        className="ml-2 text-xs text-brand-blue font-semibold px-2 py-1 bg-indigo-50 dark:bg-zinc-800 rounded-lg"
                                    >
                                        View Output
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="px-3 py-1 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                                >
                                    <i className="fa-solid fa-share-nodes"></i>
                                    <span className="hidden sm:inline">Share</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={runCode}
                                    disabled={isExecuting}
                                    className={`px-4 py-1 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer ${
                                        isExecuting
                                            ? 'bg-emerald-600/70 cursor-not-allowed opacity-80'
                                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-sm active:scale-95'
                                    }`}
                                >
                                    <i className={`fa-solid ${isExecuting ? 'fa-spinner fa-spin' : 'fa-play'} text-[10px]`}></i>
                                    <span>{isExecuting ? 'Running...' : 'Run'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Editor Code Area */}
                        <div className="flex-grow flex flex-row overflow-auto bg-white dark:bg-zinc-950 font-mono text-xs sm:text-sm">
                            <div className="w-10 sm:w-12 py-3 bg-gray-50 dark:bg-zinc-900/60 border-r border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-600 select-none text-right pr-2">
                                <pre>{getLineNumbers()}</pre>
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={code}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                spellCheck="false"
                                className="flex-grow p-3 bg-transparent outline-none resize-none text-gray-800 dark:text-gray-100 leading-relaxed font-mono"
                            />
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className={`flex flex-col flex-grow md:w-2/5 bg-gray-50 dark:bg-zinc-900 ${
                        window.innerWidth <= 867 && mobileTab === 'code' ? 'hidden' : 'flex'
                    }`}>
                        <div className="h-12 bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400">Terminal Output</span>
                                {executionStats && (
                                    <div className="hidden sm:flex items-center gap-1.5 ml-1 text-[11px] font-mono">
                                        {executionStats.cpuTime !== null && executionStats.cpuTime !== undefined && (
                                            <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold border border-emerald-200 dark:border-emerald-800/60">
                                                ⚡ {executionStats.cpuTime}s
                                            </span>
                                        )}
                                        {executionStats.memory !== null && executionStats.memory !== undefined && (
                                            <span className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-semibold border border-blue-200 dark:border-blue-800/60">
                                                💾 {executionStats.memory} KB
                                            </span>
                                        )}
                                    </div>
                                )}
                                {window.innerWidth <= 867 && (
                                    <button
                                        type="button"
                                        onClick={() => setMobileTab('code')}
                                        className="text-xs text-brand-blue font-semibold px-2 py-0.5 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200"
                                    >
                                        Back to Code
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowStdin(!showStdin)}
                                    className={`text-xs font-medium px-2 py-0.5 rounded-md transition-colors ${
                                        showStdin || stdin.trim()
                                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold'
                                            : 'text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                                    }`}
                                    title="Provide standard input (stdin) for programs that ask for user input"
                                >
                                    <i className="fa-solid fa-keyboard mr-1 text-[11px]"></i>
                                    Input
                                </button>
                                <button
                                    type="button"
                                    onClick={clearOutput}
                                    className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Collapsible Standard Input Area */}
                        {showStdin && (
                            <div className="p-3 bg-amber-50/60 dark:bg-zinc-900/80 border-b border-amber-200/60 dark:border-zinc-800 flex flex-col gap-1 shrink-0">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-amber-800 dark:text-amber-400">
                                    <span>Program Input (stdin):</span>
                                    {stdin && (
                                        <button
                                            type="button"
                                            onClick={() => setStdin('')}
                                            className="text-[10px] text-gray-400 hover:text-red-500"
                                        >
                                            Clear input
                                        </button>
                                    )}
                                </div>
                                <textarea
                                    value={stdin}
                                    onChange={(e) => setStdin(e.target.value)}
                                    placeholder="Enter inputs here (separated by newlines for multiple prompts)..."
                                    rows={2}
                                    className="w-full p-2 bg-white dark:bg-zinc-950 border border-amber-200 dark:border-zinc-700 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200 outline-none resize-none focus:border-blue-400"
                                />
                            </div>
                        )}

                        <div className="flex-grow p-4 overflow-auto font-mono text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-zinc-950">
                            <textarea
                                value={output}
                                readOnly
                                placeholder="Output will appear here after clicking Run..."
                                className="w-full h-full bg-transparent outline-none resize-none text-xs text-emerald-600 dark:text-emerald-400 font-mono leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* Floating Quick Action Buttons */}
                <div className="absolute bottom-5 right-6 flex items-center gap-2.5 z-20">
                    <button
                        type="button"
                        onClick={handleSaveCode}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                        title="Download code as .txt file"
                    >
                        <i className={`fa-solid ${saved ? 'fa-check text-emerald-400' : 'fa-floppy-disk'}`}></i>
                        <span>{saved ? 'Saved!' : 'Save'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={runCode}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] hover:opacity-95 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        <span>AI Tutor</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Editor;
