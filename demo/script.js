// Add this to the TOP - theme management
document.addEventListener('DOMContentLoaded', function() {
    // Force dark theme for demo
    document.body.classList.remove('light-theme');
});

// Claude API configuration - REPLACE WITH YOUR KEY
const CLAUDE_API_KEY = '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';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Sample COI data for demonstration (keep existing sample data)
const sampleDocuments = [
    {
        id: 1,
        name: "ABC Construction COI",
        type: "Certificate of Insurance",
        company: "ABC Construction LLC",
        issueDate: "2024-01-15",
        expiry: "2025-01-15",
        coverages: {
            "General Liability": "$2,000,000",
            "Workers Compensation": "$1,000,000",
            "Commercial Auto": "$1,000,000",
            "Umbrella": "$5,000,000"
        },
        additionalInsured: ["Property Owner LLC", "General Contractor Inc"],
        content: "This certificate evidences that ABC Construction LLC maintains the following insurance coverage. General Liability coverage with limits of $2,000,000 per occurrence and $4,000,000 aggregate. Workers Compensation coverage as required by law with limits of $1,000,000. Commercial Auto Liability coverage with combined single limit of $1,000,000. Umbrella coverage with limits of $5,000,000 per occurrence. Additional Insured status is provided to Property Owner LLC and General Contractor Inc as respects General Liability coverage."
    },
    // ... keep your other sample documents
];

let uploadedDocuments = [];

// Initialize Lucide icons
lucide.createIcons();

// File upload functionality
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const documentList = document.getElementById('documentList');
const loadSampleBtn = document.getElementById('loadSampleDocs');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const loadingState = document.getElementById('loadingState');
const aiInsights = document.getElementById('aiInsights');

// Upload zone interactions
uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', handleDragOver);
uploadZone.addEventListener('dragleave', handleDragLeave);
uploadZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);

function handleDragOver(e) {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

// Enhanced file processing with Claude API
async function processFiles(files) {
    for (const file of files) {
        const doc = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type.includes('pdf') ? 'PDF Document' : 'Image Document',
            size: formatFileSize(file.size),
            uploadTime: new Date().toLocaleString(),
            processed: false,
            processing: true
        };
        
        uploadedDocuments.push(doc);
        renderDocumentList();
        
        try {
            // Read file content
            const fileContent = await readFileContent(file);
            
            // Process with Claude API
            const claudeResult = await processDocumentWithClaude(fileContent, file.name);
            
            if (claudeResult) {
                // Update document with Claude's analysis
                doc.company = claudeResult.company || 'Unknown Company';
                doc.coverages = claudeResult.coverages || {};
                doc.expiry = claudeResult.expiry || 'Unknown';
                doc.additionalInsured = claudeResult.additionalInsured || [];
                doc.content = claudeResult.content || fileContent;
                doc.processed = true;
                doc.processing = false;
            } else {
                doc.processed = false;
                doc.processing = false;
                doc.error = 'Failed to process document';
            }
        } catch (error) {
            console.error('Error processing file:', error);
            doc.processed = false;
            doc.processing = false;
            doc.error = 'Error processing document';
        }
        
        renderDocumentList();
        updateAIInsights();
    }
}

// Helper function to read file content
function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        
        if (file.type.includes('text') || file.name.endsWith('.txt')) {
            reader.readAsText(file);
        } else {
            // For PDFs and images, we'll send the base64 data to Claude
            reader.readAsDataURL(file);
        }
    });
}

// Claude API integration
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
                max_tokens: 2000,
                messages: [{
                    role: 'user',
                    content: `Please analyze this insurance document and extract key information:

Document Name: ${fileName}
Document Content: ${fileContent}

Please extract and return information in this format:
- Company name
- Policy type  
- Issue date
- Expiry date
- Coverage types and limits
- Additional insured parties
- Brief summary of key coverage

Please provide a clear, structured response.`
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Parse Claude's response and structure it
        const analysisText = data.content[0].text;
        
        return {
            company: extractCompanyName(analysisText),
            content: analysisText,
            processed: true
        };
        
    } catch (error) {
        console.error('Error calling Claude API:', error);
        return null;
    }
}

// Helper function to extract company name from Claude's response
function extractCompanyName(text) {
    const companyMatch = text.match(/Company name:?\s*(.+)/i);
    return companyMatch ? companyMatch[1].trim() : 'Unknown Company';
}

// Enhanced search with Claude API
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query || uploadedDocuments.length === 0) {
        showEmptyState();
        return;
    }

    showLoadingState();
    
    try {
        // Use Claude API for intelligent search
        const searchResults = await searchDocumentsWithClaude(query, uploadedDocuments);
        
        if (searchResults) {
            displayClaudeSearchResults(searchResults, query);
        } else {
            // Fallback to local search
            const results = performLocalSearch(query);
            displaySearchResults(results, query);
        }
    } catch (error) {
        console.error('Search error:', error);
        // Fallback to local search
        const results = performLocalSearch(query);
        displaySearchResults(results, query);
    }
    
    hideLoadingState();
}

// Claude-powered search
async function searchDocumentsWithClaude(query, documents) {
    try {
        const documentsText = documents.map(doc => 
            `Document: ${doc.name}\nCompany: ${doc.company}\nContent: ${doc.content || 'Content not available'}`
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
                max_tokens: 1500,
                messages: [{
                    role: 'user',
                    content: `Search through these insurance documents and answer: "${query}"

Documents:
${documentsText}

Please provide:
1. Direct answer to the question
2. Which documents contain relevant information
3. Specific quotes or data points
4. Any risk insights or recommendations

Be specific and cite the document names when referencing information.`
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Search API request failed: ${response.status}`);
        }

        const data = await response.json();
        return {
            answer: data.content[0].text,
            documents: documents // Pass through for display
        };
        
    } catch (error) {
        console.error('Error searching with Claude:', error);
        return null;
    }
}

// Display Claude search results
function displayClaudeSearchResults(searchResults, query) {
    searchResults.innerHTML = `
        <div class="result-item">
            <div class="result-title">AI Analysis Results</div>
            <div class="result-snippet">
                ${searchResults.answer.replace(/\n/g, '<br>')}
            </div>
            <div class="result-metadata">
                <div class="metadata-item">
                    <i data-lucide="brain" style="width: 12px; height: 12px;"></i>
                    Powered by Claude AI
                </div>
                <div class="metadata-item">
                    <i data-lucide="file-text" style="width: 12px; height: 12px;"></i>
                    ${uploadedDocuments.length} documents analyzed
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

// Keep all your existing functions (renderDocumentList, performLocalSearch, etc.)
// ... [rest of your existing script.js code]