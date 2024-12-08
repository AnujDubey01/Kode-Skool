import React, { useEffect, useState, useRef } from 'react'
import './Editor.css';

// Object with languages and their boilerplate code
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
    // State to manage the current language and its code
    const [currentLanguage, setCurrentLanguage] = useState("C");
    const [code, setCode] = useState(languages["C"]); // Initial boilerplate code for C
    const [output, setOutput] = useState("");
    const [fullEditor, setFullEditor] = useState(false);
    const textareaRef = useRef(null);

    const handleInputChange = (e) => {
        setCode(e.target.value);
    };

    // Function to switch languages
    const switchLanguage = (language) => {
        setCurrentLanguage(language);
        setCode(languages[language]); // Update code with the selected language's boilerplate
        setOutput("")
    };

    // Function to run code
    const runCode = () => {
        setOutput("Hello, World!");
    }

    // Clearing Output Section
    const clearOutput = () => { setOutput("") }

    // Adjust the height of the textarea based on its content
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height to recalculate
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    // Adjust navbar for fullscreen
    const fullScreen = (e) => {
        props.dashboardNav.current.classList.toggle('full-screen');
        if(props.dashboardNav.current.classList.contains('full-screen')){
            setFullEditor(true);
        }else{
            setFullEditor(false);
        }
    }

    useEffect(() => {
        adjustTextareaHeight();
    }, [code]);

    const getLineNumbers = () => {
        const lines = code.split("\n").length;
        return Array.from({ length: lines }, (_, i) => i + 1).join("\n");
    };


    // Handle keydown for tab, enter, and bracket completion
    const handleKeyDown = (e) => {
        const { selectionStart, selectionEnd } = e.target;
        const value = e.target.value;

        if (e.key === "Tab") {
            e.preventDefault();
            // Insert a tab space
            const updatedCode =
                value.substring(0, selectionStart) +
                "    " + // 4 spaces for a tab
                value.substring(selectionEnd);
            setCode(updatedCode);

            // Move the cursor to after the tab
            setTimeout(() => {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 4;
            }, 0);
        }

        if (e.key === "Enter") {
            e.preventDefault();
            // Find the current line's indentation
            const currentLine = value.substring(0, selectionStart).split("\n").pop();
            const indentation = currentLine.match(/^\s*/)[0] || "";

            // Insert a new line with the same indentation
            const updatedCode =
                value.substring(0, selectionStart) +
                "\n" +
                indentation +
                value.substring(selectionEnd);
            setCode(updatedCode);

            // Move the cursor to after the new line
            setTimeout(() => {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + indentation.length + 1;
            }, 0);
        }

        // Bracket completion logic
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

            // Move the cursor inside the brackets
            setTimeout(() => {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 1;
            }, 0);
        }
    };

    return (
        <>
            <div className="EditorContainer">
                <div className="langController">
                    <div className="fullScreen" onClick={fullScreen}>
                        {fullEditor? <i className="fa-solid fa-bars"></i> : <i className="fa-solid fa-expand"></i>}
                    </div>
                    <div className="langOptions">
                        {Object.keys(languages).map((language) => (
                            <div
                                key={language}
                                className={`langBox ${currentLanguage === language ? "active" : ""}`}
                                onClick={() => switchLanguage(language)}
                            >
                                {language}
                            </div>
                        ))}
                    </div>
                </div>
                <section className='Editor'>
                    <div className="codeSection">
                        <div className="codeSectionHead">
                            <div className="filetab">
                                <div className="filename">
                                    Main.c
                                </div>
                                <div className="fileadd">
                                    +
                                </div>
                            </div>
                            <div className="codeBtns">
                                <button type="button" className='shareCodeBtn'>
                                    <i className="fa-solid fa-share-nodes"></i>
                                    Share
                                </button>
                                <button type="button" className='runBtn' onClick={runCode}>Run</button>
                            </div>
                        </div>
                        <div className="code-editor">
                            <div className="line-numbers">
                                <pre>{getLineNumbers()}</pre>
                            </div>
                            <textarea
                                ref={textareaRef}
                                className="code-input"
                                value={code}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                spellCheck="false"
                            />
                        </div>
                    </div>
                    <div className="outputSection">
                        <div className="outputSectionHead">
                            <div className="outputHeader">Output</div>
                            <button type='button' className='clearBtn' onClick={clearOutput}>Clear</button>
                        </div>
                        <div className="code-output-container">
                            <textarea
                                className="code-output"
                                value={output}
                                spellCheck="false"
                                disabled="true"
                            />
                        </div>
                    </div>
                    <div className="code-save-btns">
                        <button type="button" className='saveCodeBtn'>Save</button>
                        <button type="button" className='AIBtn' onClick={runCode}>AI</button>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Editor