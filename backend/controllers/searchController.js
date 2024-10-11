const JobType = require('../models/jobTypeModel'); // Import JobType model
const OpenAI = require('openai');

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // OpenAI API key
});

// Controller function for handling AI-based job search
const search = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    try {
        // Step 1: Fetch all job types from the database
        const jobTitles = await JobType.findAll({
            attributes: ['main', 'sub'] // Only select the main and sub fields
        });

        // Convert job titles to a format the AI can understand
        const jobList = jobTitles.map(job => `${job.main} - ${job.sub}`).join('\n');

        // Step 2: Get AI's matching job suggestion based on the query and job titles
        const aiJobType = await getAiJobMatch(query, jobList);

        // Step 3: If AI provides a valid suggestion, search the job_type table
        if (aiJobType) {
            const matchingJob = await JobType.findOne({
                where: {
                    main: aiJobType.main,
                    sub: aiJobType.sub
                }
            });

            // Step 4: If we find a match in the database, return it
            if (matchingJob) {
                return res.json({
                    success: true,
                    jobType: matchingJob
                });
            } else {
                // Step 5: If AI suggests something not in the database, return "job not available"
                const firstJob = jobTitles[0];

                // Step 3: Return the first job type as JSON
                return res.json({
                    success: true,
                    jobType: {
                        main: firstJob.main,
                        sub: firstJob.sub
                    }
                });
            }
        } else
        {
            // Step 6: If AI doesn't find a match, return a "job not found" message
            const firstJob = jobTitles[0];

            // Step 3: Return the first job type as JSON
            return res.json({
                success: true,
                jobType: {
                    main: firstJob.main,
                    sub: firstJob.sub
                }
            });
        }
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ success: false, message: 'Error performing search' });
    }
};

// Function to interact with the OpenAI API and get a job type match
const getAiJobMatch = async (query, jobList) => {
    try {
        // Call the OpenAI API to get suggestions for main and sub job types
        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant' },
                { role: 'user', content: `
                
                From the following data, please match the most appropriate main and sub categories for the user query: ' . "\\n\\n" . ${jobList} . "\\n\\nUser query: " . ${query} . "\\n\\nPlease respond with only the main and sub values from the data provided, without any additional text.
                return like this  main1value-subvalue1
              `  }
            ],
            max_tokens: 100
        });

        // Extract and parse suggestions from the AI response
        const text = response.choices[0].message.content;
        const suggestions = parseSuggestions(text);

        // Return the parsed suggestions, or null if no valid suggestions were found
        return suggestions.length > 0 ? suggestions[0] : null;

    } catch (error) {
        console.error('AI suggestion error:', error);
        return null; // Return null if there's an error communicating with OpenAI
    }
};

// Helper function to parse suggestions from OpenAI response
const parseSuggestions = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const suggestions = [];

    lines.forEach(line => {
        if (line.includes('-')) {
            const [main, sub] = line.split('-').map(s => s.trim());
            suggestions.push({ main, sub });
        }
    });

    return suggestions;
};

module.exports = {
    search
};
