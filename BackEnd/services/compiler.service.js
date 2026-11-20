const LANGUAGE_CONFIG = {
    C: { language: 'c', versionIndex: '5' },
    c: { language: 'c', versionIndex: '5' },
    'C++': { language: 'cpp17', versionIndex: '1' },
    cpp: { language: 'cpp17', versionIndex: '1' },
    'cpp17': { language: 'cpp17', versionIndex: '1' },
    Java: { language: 'java', versionIndex: '4' },
    java: { language: 'java', versionIndex: '4' },
    Py: { language: 'python3', versionIndex: '4' },
    python: { language: 'python3', versionIndex: '4' },
    python3: { language: 'python3', versionIndex: '4' },
    SQL: { language: 'sql', versionIndex: '4' },
    sql: { language: 'sql', versionIndex: '4' },
    Swift: { language: 'swift', versionIndex: '4' },
    swift: { language: 'swift', versionIndex: '4' },
    JS: { language: 'nodejs', versionIndex: '4' },
    js: { language: 'nodejs', versionIndex: '4' },
    nodejs: { language: 'nodejs', versionIndex: '4' },
    javascript: { language: 'nodejs', versionIndex: '4' },
    R: { language: 'r', versionIndex: '4' },
    r: { language: 'r', versionIndex: '4' },
    Ruby: { language: 'ruby', versionIndex: '4' },
    ruby: { language: 'ruby', versionIndex: '4' },
    Rust: { language: 'rust', versionIndex: '4' },
    rust: { language: 'rust', versionIndex: '4' }
};

/**
 * Executes source code via JDoodle API
 * @param {string} script - Source code to execute
 * @param {string} language - Programming language (e.g. "Py", "C++", "Java", etc.)
 * @param {string} [stdin=""] - Optional standard input for the program
 */
const executeCode = async (script, language, stdin = '') => {
    const clientId = process.env.JDOODLE_CLIENT_ID;
    const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('JDoodle API credentials are not configured in backend .env');
    }

    const config = LANGUAGE_CONFIG[language];
    if (!config) {
        throw new Error(`Language "${language}" is not supported by compiler`);
    }

    const payload = {
        clientId,
        clientSecret,
        script,
        language: config.language,
        versionIndex: config.versionIndex,
        stdin: stdin || ''
    };

    const response = await fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok && response.status !== 200) {
        const errorText = await response.text();
        throw new Error(`JDoodle API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

module.exports = {
    executeCode,
    LANGUAGE_CONFIG
};
