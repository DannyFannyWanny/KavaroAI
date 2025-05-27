// Backend API endpoint to handle Claude API calls
const CLAUDE_API_KEY = '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';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Function to process uploaded files with Claude
async function processDocumentWithClaude(fileContent, fileName) {
    try {
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: `Please analyze this insurance document and extract key information:

Document Name: ${fileName}
Document Content: ${fileContent}

Please extract and return in JSON format:
- Company name
- Policy type
- Issue date
- Expiry date
- Coverage types and limits
- Additional insured parties
- Key terms and conditions

Format your response as clean JSON only.`
                }]
            })
        });

        const data = await response.json();
        return JSON.parse(data.content[0].text);
    } catch (error) {
        console.error('Error processing document:', error);
        return null;
    }
}

// Function to search documents with Claude
async function searchDocumentsWithClaude(query, documents) {
    try {
        const documentsText = documents.map(doc => 
            `Document: ${doc.name}\nCompany: ${doc.company}\nContent: ${doc.content}`
        ).join('\n\n---\n\n');

        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: `Search through these insurance documents and answer the question: "${query}"

Documents:
${documentsText}

Please provide:
1. Which documents are relevant
2. Specific answers with quotes from the documents
3. Risk insights or recommendations

Format as JSON with: {
    "results": [{"document": "name", "relevance": score, "excerpts": ["text1", "text2"]}],
    "answer": "direct answer to the question",
    "insights": ["insight1", "insight2"]
}`
                }]
            })
        });

        const data = await response.json();
        return JSON.parse(data.content[0].text);
    } catch (error) {
        console.error('Error searching documents:', error);
        return null;
    }
}