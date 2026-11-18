import React, { useEffect, useState, useRef } from 'react';

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
    const [fullEditor, setFullEditor] = useState(false);
    const [mobileTab, setMobileTab] = useState('code'); // 'code' | 'output'
    const textareaRef = useRef(null);

    const handleInputChange = (e) => {
        setCode(e.target.value);
    };

    const switchLanguage = (language) => {
        setCurrentLanguage(language);
        setCode(languages[language]);
        setOutput("");
    };

    const runCode = () => {
        setOutput("Hello, World!");
        if (window.innerWidth < 866) setMobileTab('output');
    };

    const clearOutput = () => { setOutput(""); };

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
        <div className="w-full h-[92vh] flex flex-col pt-3">
            {/* Mobile Header */}
            {window.innerWidth <= 867 && (
                <div className="flex flex-row justify-between items-center w-full px-4 mb-3 shrink-0">
                    <div className="flex flex-row items-center gap-3">
                        <div className="cursor-pointer text-xl text-gray-700 dark:text-gray-200" onClick={props.controlNav}>
                            <i className="fa-solid fa-list-ul"></i>
                        </div>
                        <div ref={welcome} className="flex flex-col">
                            <h1 className="text-base font-semibold text-gray-900 dark:text-white">Welcome {userName}!</h1>
                            <p className="text-[11px] text-gray-500">Let's crack the code</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-xs`}>
                            <i className="fa-solid fa-magnifying-glass text-gray-400 mr-1.5" onClick={openSearchOpt}></i>
                            <input ref={search} type="text" name="search" id="search" className="bg-transparent outline-none w-20 text-xs text-gray-800 dark:text-gray-100" placeholder="Search" />
                        </div>
                        <div className="relative cursor-pointer text-gray-600 dark:text-gray-300 text-sm">
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">5</span>
                            <ion-icon name="notifications"></ion-icon>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop / Responsive IDE Frame */}
            <div className="flex-grow flex flex-row border-t border-gray-200 dark:border-zinc-800 overflow-hidden relative">
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
                                    className="px-4 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <i className="fa-solid fa-play text-[10px]"></i>
                                    <span>Run</span>
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
                            <button
                                type="button"
                                onClick={clearOutput}
                                className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                            >
                                Clear
                            </button>
                        </div>
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
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Save</span>
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
