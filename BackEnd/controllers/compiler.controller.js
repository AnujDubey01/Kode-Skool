const compilerService = require('../services/compiler.service');

/**
 * Controller to handle code execution requests from the frontend editor
 */
const execute = async (req, res) => {
    try {
        const { script, language, stdin } = req.body;

        if (!script || typeof script !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Source code (script) is required.'
            });
        }

        if (!language || typeof language !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Programming language is required.'
            });
        }

        const result = await compilerService.executeCode(script, language, stdin);

        return res.status(200).json({
            success: true,
            output: result.output || '',
            error: result.error || null,
            statusCode: result.statusCode,
            memory: result.memory || null,
            cpuTime: result.cpuTime || null,
            isExecutionSuccess: result.isExecutionSuccess !== false
        });

    } catch (error) {
        console.error('Compiler Controller Error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to execute code on compiler service'
        });
    }
};

module.exports = {
    execute
};
