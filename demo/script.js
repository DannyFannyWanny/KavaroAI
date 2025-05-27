// Theme management - keep at top
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.remove('light-theme');
});

// Claude API configuration
const CLAUDE_API_KEY = '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';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Sample COI data for demonstration
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
        content: "This certificate evidences that ABC Construction LLC maintains the following insurance coverage. General Liability coverage with limits of $2,000,000 per occurrence and $4,000,000 aggregate. Workers Compensation coverage as required by law with limits of $1,000,000. Commercial Auto Liability coverage with combined single limit of $1,000,000. Umbrella coverage with limits of $5,000,000 per occurrence. Additional Insured status is provided to Property Owner LLC and General Contractor Inc as respects General Liability coverage.",
        processed: true,
        processing: false
    },
    {
        id: 2,
        name: "XYZ Plumbing COI",
        type: "Certificate of Insurance",
        company: "XYZ Plumbing Services",
        issueDate: "2024-02-01",
        expiry: "2025-02-01",
        coverages: {
            "General Liability": "$1,000,000",
            "Workers Compensation": "$500,000",
            "Commercial Auto": "$1,000,000",
            "Professional Liability": "$2,000,000"
        },
        additionalInsured: ["Building Owner Corp"],
        content: "Certificate of Insurance for XYZ Plumbing Services. Coverage includes General Liability $1,000,000 per occurrence, Workers Compensation $500,000, Commercial Auto Liability $1,000,000, and Professional Liability $2,000,000. Building Owner Corp is named as additional insured on General Liability policy.",
        processed: true,
        processing: false
    }
];

let uploadedDocuments = [];

// Initialize Lucide icons
lucide.createIcons();

// Get DOM elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const documentList = document.getElementById('documentList');
const loadSampleBtn = document.getElementById('loadSampleDocs');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const loadingState = document.getElementById('loadingState');
const aiInsights = document.getElementById('aiInsights');

// Event listeners
uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', handleDragOver);
uploadZone.addEventListener('dragleave', handleDragLeave);
uploadZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
loadSampleBtn.addEventListener('click', loadSampleDocuments);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Add click handlers for suggestion chips
document.addEventListener('DOMContentLoaded', function() {
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const searchTerm = this.getAttribute('data-search');
            searchInput.value = searchTerm;
            handleSearch();
        });
    });
});

// Drag and drop handlers
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

// File processing with Claude API
async function processFiles(files) {
    for (const file of files) {
        const doc = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type.includes('pdf') ? 'PDF Document' : 'Image Document',
            size: formatFileSize(file.size),
            uploadTime: new Date().toLocaleString(),
            processed: false,
            processing: true,
            company: 'Processing...',
            content: ''
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
                Object.assign(doc, {
                    company: claudeResult.company || 'Unknown Company',
                    coverages: claudeResult.coverages || {},
                    expiry: claudeResult.expiry || 'Unknown',
                    issueDate: claudeResult.issueDate || 'Unknown',
                    additionalInsured: claudeResult.additionalInsured || [],
                    content: claudeResult.summary || fileContent.substring(0, 500),
                    processed: true,
                    processing: false
                });
            } else {
                Object.assign(doc, {
                    processed: false,
                    processing: false,
                    error: 'Failed to process document',
                    company: 'Processing Failed'
                });
            }
        } catch (error) {
            console.error('Error processing file:', error);
            Object.assign(doc, {
                processed: false,
                processing: false,
                error: 'Error processing document',
                company: 'Error'
            });
        }
        
        renderDocumentList();
        updateAIInsights();
    }
}

// Helper function to read file content
function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (file.type.includes('text')) {
                resolve(e.target.result);
            } else {
                // For PDFs and images, we'll use a simplified approach
                // In production, you'd want proper OCR/PDF parsing
                resolve(`Document: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes\n[Binary content - would need OCR/PDF parsing in production]`);
            }
        };
        reader.onerror = reject;
        
        if (file.type.includes('text')) {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    });
}

// Claude API integration for document processing
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
                    content: `Analyze this insurance document and extract key information:

Document Name: ${fileName}
Content: ${fileContent}

Please extract and provide:
1. Company/Insured name
2. Policy type (COI, Policy, etc.)
3. Issue date
4. Expiry/effective dates
5. Coverage types and limits
6. Additional insured parties
7. Brief summary of key points

Format your response clearly with labeled sections.`
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const analysisText = data.content[0].text;
        
        // Parse Claude's response
        return {
            company: extractField(analysisText, 'company|insured'),
            issueDate: extractField(analysisText, 'issue date|issued'),
            expiry: extractField(analysisText, 'expiry|expiration|expires'),
            coverages: extractCoverages(analysisText),
            additionalInsured: extractAdditionalInsured(analysisText),
            summary: analysisText
        };
        
    } catch (error) {
        console.error('Error calling Claude API:', error);
        return null;
    }
}

// Helper functions to extract specific fields
function extractField(text, fieldPattern) {
    const regex = new RegExp(`(?:${fieldPattern}):?\\s*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not specified';
}

function extractCoverages(text) {
    const coverages = {};
    const coveragePatterns = [
        'general liability',
        'workers compensation',
        'commercial auto',
        'professional liability',
        'umbrella',
        'property'
    ];
    
    coveragePatterns.forEach(coverage => {
        const regex = new RegExp(`${coverage}[^\\n]*\\$([\\d,]+)`, 'i');
        const match = text.match(regex);
        if (match) {
            coverages[coverage.charAt(0).toUpperCase() + coverage.slice(1)] = `$${match[1]}`;
        }
    });
    
    return coverages;
}

function extractAdditionalInsured(text) {
    const aiRegex = /additional insured[^:]*:?\s*([^\.]+)/i;
    const match = text.match(aiRegex);
    if (match) {
        return match[1].split(/[,&]/).map(ai => ai.trim()).filter(ai => ai.length > 0);
    }
    return [];
}

// Search functionality with Claude API
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        showEmptyState();
        return;
    }
    
    const allDocuments = [...uploadedDocuments, ...sampleDocuments];
    if (allDocuments.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i data-lucide="file-text" style="width: 64px; height: 64px;"></i>
                </div>
                <div>Please upload some documents first to search through them.</div>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    showLoadingState();
    
    try {
        const searchResults = await searchDocumentsWithClaude(query, allDocuments);
        
        if (searchResults) {
            displayClaudeSearchResults(searchResults, query);
        } else {
            // Fallback to local search
            const results = performLocalSearch(query, allDocuments);
            displaySearchResults(results, query);
        }
    } catch (error) {
        console.error('Search error:', error);
        // Fallback to local search
        const results = performLocalSearch(query, allDocuments);
        displaySearchResults(results, query);
    }
    
    hideLoadingState();
}

// Claude-powered search
async function searchDocumentsWithClaude(query, documents) {
    try {
        const documentsText = documents.map(doc => 
            `Document: ${doc.name}
Company: ${doc.company}
Expiry: ${doc.expiry}
Coverages: ${JSON.stringify(doc.coverages || {})}
Content: ${doc.content || 'No content available'}`
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
2. Which specific documents contain relevant information
3. Key quotes or data points from those documents
4. Any risk insights or recommendations

Be specific and cite document names when referencing information.`
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Search API request failed: ${response.status}`);
        }

        const data = await response.json();
        return {
            answer: data.content[0].text,
            documents: documents
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
            <div class="result-title">🧠 AI Analysis Results</div>
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
                    ${uploadedDocuments.length + sampleDocuments.length} documents analyzed
                </div>
                <div class="metadata-item">
                    <i data-lucide="search" style="width: 12px; height: 12px;"></i>
                    Query: "${query}"
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

// Fallback local search
function performLocalSearch(query, documents) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    documents.forEach(doc => {
        let relevanceScore = 0;
        let matchedContent = '';
        
        // Search in various fields
        const searchFields = [
            { field: doc.name, weight: 3 },
            { field: doc.company, weight: 3 },
            { field: doc.content, weight: 1 },
            { field: JSON.stringify(doc.coverages || {}), weight: 2 },
            { field: (doc.additionalInsured || []).join(' '), weight: 2 }
        ];
        
        searchFields.forEach(({ field, weight }) => {
            if (field && field.toLowerCase().includes(queryLower)) {
                relevanceScore += weight;
                if (field === doc.content) {
                    const startIndex = Math.max(0, field.toLowerCase().indexOf(queryLower) - 50);
                    matchedContent = field.substring(startIndex, startIndex + 200) + '...';
                }
            }
        });
        
        if (relevanceScore > 0) {
            results.push({
                document: doc,
                relevanceScore,
                matchedContent: matchedContent || doc.content?.substring(0, 200) + '...' || 'No content preview available'
            });
        }
    });
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Display regular search results
function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i data-lucide="search-x" style="width: 64px; height: 64px;"></i>
                </div>
                <div>No results found for "${query}"</div>
                <div style="margin-top: 1rem; opacity: 0.7; font-size: 14px;">Try different keywords or load sample documents</div>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    const resultsHTML = results.map(result => {
        const doc = result.document;
        const highlightedContent = result.matchedContent.replace(
            new RegExp(query, 'gi'),
            match => `<span class="highlight">${match}</span>`
        );
        
        return `
            <div class="result-item">
                <div class="result-title">${doc.name}</div>
                <div class="result-snippet">${highlightedContent}</div>
                <div class="result-metadata">
                    <div class="metadata-item">
                        <i data-lucide="building" style="width: 12px; height: 12px;"></i>
                        ${doc.company}
                    </div>
                    <div class="metadata-item">
                        <i data-lucide="calendar" style="width: 12px; height: 12px;"></i>
                        Expires: ${doc.expiry}
                    </div>
                    <div class="metadata-item">
                        <i data-lucide="star" style="width: 12px; height: 12px;"></i>
                        Relevance: ${result.relevanceScore}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    searchResults.innerHTML = resultsHTML;
    lucide.createIcons();
}

// Load sample documents
function loadSampleDocuments() {
    uploadedDocuments = [...sampleDocuments];
    renderDocumentList();
    updateAIInsights();
    
    // Show success message
    const button = loadSampleBtn;
    const originalText = button.textContent;
    button.textContent = '✅ Sample documents loaded!';
    button.style.background = '#30D158';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#007AFF';
    }, 2000);
}

// Render document list
function renderDocumentList() {
    if (uploadedDocuments.length === 0) {
        documentList.innerHTML = '';
        return;
    }
    
    const documentsHTML = uploadedDocuments.map(doc => `
        <div class="document-item">
            <div class="doc-icon">
                ${doc.processing ? 
                    '<div class="spinner" style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white;"></div>' :
                    '<i data-lucide="file-text" style="width: 20px; height: 20px;"></i>'
                }
            </div>
            <div class="doc-info">
                <div class="doc-name">${doc.name}</div>
                <div class="doc-details">
                    ${doc.processing ? 'Processing with AI...' : 
                      doc.processed ? `${doc.company} • Expires: ${doc.expiry}` :
                      doc.error || 'Ready for processing'}
                </div>
            </div>
        </div>
    `).join('');
    
    documentList.innerHTML = documentsHTML;
    lucide.createIcons();
}

// Update AI insights
function updateAIInsights() {
    const processedDocs = uploadedDocuments.filter(doc => doc.processed);
    
    if (processedDocs.length === 0) {
        aiInsights.style.display = 'none';
        return;
    }
    
    const insights = [];
    
    // Check for expiring certificates (within 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    processedDocs.forEach(doc => {
        if (doc.expiry && doc.expiry !== 'Unknown') {
            const expiryDate = new Date(doc.expiry);
            if (expiryDate <= thirtyDaysFromNow && expiryDate > today) {
                insights.push({
                    type: 'expiry',
                    icon: '⚠️',
                    text: `${doc.company} certificate expires ${doc.expiry}`
                });
            }
        }
        
        // Check coverage limits
        if (doc.coverages) {
            Object.entries(doc.coverages).forEach(([coverage, limit]) => {
                const amount = parseInt(limit.replace(/[$,]/g, ''));
                if (amount < 1000000) {
                    insights.push({
                        type: 'coverage',
                        icon: '🔍',
                        text: `${doc.company} has low ${coverage} coverage: ${limit}`
                    });
                }
            });
        }
    });
    
    // General insights
    insights.push({
        type: 'risk',
        icon: '📊',
        text: `Analyzed ${processedDocs.length} documents with AI-powered intelligence`
    });
    
    const insightsHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-icon insight-${insight.type}">
                ${insight.icon}
            </div>
            <div>${insight.text}</div>
        </div>
    `).join('');
    
    document.getElementById('insightsList').innerHTML = insightsHTML;
    aiInsights.style.display = 'block';
}

// Loading and empty state functions
function showLoadingState() {
    loadingState.classList.add('active');
    searchResults.innerHTML = '';
}

function hideLoadingState() {
    loadingState.classList.remove('active');
}

function showEmptyState() {
    searchResults.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <i data-lucide="search" style="width: 64px; height: 64px;"></i>
            </div>
            <div>Enter a search query to find information in your documents</div>
        </div>
    `;
    lucide.createIcons();
}

// Utility function
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}