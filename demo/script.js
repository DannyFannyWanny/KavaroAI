// Theme management - keep at top
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.remove('light-theme');
});

// Claude API configuration - Updated for 2025
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
    },
    {
        id: 3,
        name: "Tech Solutions COI",
        type: "Certificate of Insurance",
        company: "Tech Solutions Inc",
        issueDate: "2024-03-10",
        expiry: "2024-12-31",
        coverages: {
            "General Liability": "$3,000,000",
            "Professional Liability": "$5,000,000",
            "Cyber Liability": "$2,000,000"
        },
        additionalInsured: ["Client Corp", "Vendor LLC"],
        content: "Certificate of Insurance for Tech Solutions Inc. Professional services company with General Liability $3,000,000, Professional Liability $5,000,000, and Cyber Liability $2,000,000. Multiple additional insureds including Client Corp and Vendor LLC.",
        processed: true,
        processing: false
    }
];

let uploadedDocuments = [];

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

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
if (uploadZone) {
    uploadZone.addEventListener('click', () => fileInput?.click());
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);
}

if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
}

if (loadSampleBtn) {
    loadSampleBtn.addEventListener('click', loadSampleDocuments);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

// Add click handlers for suggestion chips after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const searchTerm = this.getAttribute('data-search');
                if (searchInput) {
                    searchInput.value = searchTerm;
                    handleSearch();
                }
            });
        });
    }, 100);
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
            type: file.type.includes('pdf') ? 'PDF Document' : 
                  file.type.includes('image') ? 'Image Document' : 'Text Document',
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
                // For PDFs and images, we'll provide a description
                resolve(`Document: ${file.name}\nType: ${file.type}\nSize: ${formatFileSize(file.size)}\n\nThis is a ${file.type.includes('pdf') ? 'PDF' : 'image'} file. In a production environment, this would be processed with OCR or PDF parsing to extract the actual text content. For this demo, please use the sample documents or upload text files to see the full AI processing capabilities.`);
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

// Claude API integration for document processing - Updated for 2025
async function processDocumentWithClaude(fileContent, fileName) {
    try {
        console.log('Processing document with Claude API...');
        
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: [{
                    role: 'user',
                    content: `Analyze this insurance document and extract key information:

Document Name: ${fileName}
Content: ${fileContent}

Please extract and provide the following information in a clear, structured format:
1. Company/Insured name
2. Policy type (COI, Policy, etc.)
3. Issue date
4. Expiry/effective dates
5. Coverage types and limits (list each coverage with its limit)
6. Additional insured parties (if any)
7. Brief summary of key points

Please format your response clearly with labeled sections for easy parsing.`
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Claude API Response:', data);
        
        if (!data.content || !data.content[0]) {
            throw new Error('Invalid response format from Claude API');
        }
        
        const analysisText = data.content[0].text;
        
        // Parse Claude's response
        return {
            company: extractField(analysisText, ['company', 'insured', 'organization']),
            issueDate: extractField(analysisText, ['issue date', 'issued', 'effective date']),
            expiry: extractField(analysisText, ['expiry', 'expiration', 'expires']),
            coverages: extractCoverages(analysisText),
            additionalInsured: extractAdditionalInsured(analysisText),
            summary: analysisText
        };
        
    } catch (error) {
        console.error('Error calling Claude API:', error);
        return null;
    }
}

// Helper functions to extract specific fields - Improved
function extractField(text, fieldPatterns) {
    for (const pattern of fieldPatterns) {
        const regex = new RegExp(`(?:${pattern}):?\\s*([^\\n]+)`, 'i');
        const match = text.match(regex);
        if (match && match[1].trim()) {
            return match[1].trim();
        }
    }
    return 'Not specified';
}

function extractCoverages(text) {
    const coverages = {};
    const lines = text.split('\n');
    
    // Look for coverage patterns
    const coveragePatterns = [
        /general liability[:\s]*[\$]?([\d,]+)/i,
        /workers compensation[:\s]*[\$]?([\d,]+)/i,
        /commercial auto[:\s]*[\$]?([\d,]+)/i,
        /professional liability[:\s]*[\$]?([\d,]+)/i,
        /umbrella[:\s]*[\$]?([\d,]+)/i,
        /property[:\s]*[\$]?([\d,]+)/i,
        /cyber[:\s]*[\$]?([\d,]+)/i
    ];
    
    lines.forEach(line => {
        coveragePatterns.forEach(pattern => {
            const match = line.match(pattern);
            if (match) {
                const coverageType = pattern.source.split('[')[0].replace(/\\/g, '').replace(/\|/g, ' ');
                const amount = match[1];
                const formattedType = coverageType.charAt(0).toUpperCase() + coverageType.slice(1);
                coverages[formattedType] = `$${amount}`;
            }
        });
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

// Search functionality with Claude API - Updated for 2025
async function handleSearch() {
    const query = searchInput.value.trim();
    console.log('Search initiated with query:', query);
    
    if (!query) {
        showEmptyState();
        return;
    }
    
    const allDocuments = [...uploadedDocuments, ...sampleDocuments];
    console.log('Total documents available:', allDocuments.length);
    console.log('Documents:', allDocuments.map(d => ({ name: d.name, company: d.company })));
    
    if (allDocuments.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i data-lucide="file-text" style="width: 64px; height: 64px;"></i>
                </div>
                <div>Please upload some documents first or load sample documents to search through them.</div>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    showLoadingState();
    
    try {
        console.log('Attempting Claude API search...');
        const searchResult = await searchDocumentsWithClaude(query, allDocuments);
        
        if (searchResult) {
            console.log('Claude search successful, displaying results');
            displayClaudeSearchResults(searchResult, query);
        } else {
            console.log('Claude search failed, falling back to local search');
            const results = performLocalSearch(query, allDocuments);
            console.log('Local search results:', results.length, 'matches found');
            displaySearchResults(results, query);
        }
    } catch (error) {
        console.error('Search error:', error);
        // Fallback to local search
        const results = performLocalSearch(query, allDocuments);
        console.log('Fallback local search results:', results.length, 'matches found');
        displaySearchResults(results, query);
    }
    
    hideLoadingState();
}

// Enhanced Claude-powered search with better error handling
async function searchDocumentsWithClaude(query, documents) {
    try {
        console.log('=== CLAUDE API SEARCH DEBUG ===');
        console.log('API Key (first 10 chars):', CLAUDE_API_KEY.substring(0, 10) + '...');
        console.log('Query:', query);
        console.log('Documents count:', documents.length);
        
        const documentsText = documents.map(doc => 
            `Document: ${doc.name}
Company: ${doc.company}
Expiry: ${doc.expiry}
Issue Date: ${doc.issueDate || 'N/A'}
Coverages: ${JSON.stringify(doc.coverages || {})}
Additional Insured: ${(doc.additionalInsured || []).join(', ')}
Content: ${doc.content || 'No content available'}`
        ).join('\n\n---\n\n');

        console.log('Documents text length:', documentsText.length);
        console.log('Sample document text:', documentsText.substring(0, 300) + '...');

        const requestPayload = {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1500,
            messages: [{
                role: 'user',
                content: `You are an insurance document analysis expert. Search through these insurance documents and answer the following question: "${query}"

Documents:
${documentsText}

Please provide:
1. A direct, clear answer to the question
2. Which specific documents contain relevant information (mention document names)
3. Key quotes or data points from those documents
4. Any risk insights or recommendations based on the information

Be specific and cite the document names when referencing information. Format your response in a clear, professional manner suitable for insurance professionals.`
            }]
        };

        console.log('Request payload model:', requestPayload.model);
        console.log('Request payload message length:', requestPayload.messages[0].content.length);

        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify(requestPayload)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            
            // Try to parse error JSON
            try {
                const errorJson = JSON.parse(errorText);
                console.error('Parsed error:', errorJson);
            } catch (e) {
                console.error('Could not parse error as JSON');
            }
            
            throw new Error(`Search API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Claude API Success Response:', data);
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
            console.error('Invalid response structure:', data);
            throw new Error('Invalid response format from Claude API');
        }
        
        return {
            answer: data.content[0].text,
            documents: documents
        };
        
    } catch (error) {
        console.error('=== CLAUDE API ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        return null;
    }
}

// Display Claude search results
function displayClaudeSearchResults(searchResult, query) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
        <div class="result-item">
            <div class="result-title">🧠 AI Analysis Results</div>
            <div class="result-snippet">
                ${searchResult.answer.replace(/\n/g, '<br>')}
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
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function performLocalSearch(query, documents) {
    console.log('=== LOCAL SEARCH DEBUG ===');
    console.log('Query:', query);
    console.log('Documents to search:', documents.length);
    
    const results = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    
    console.log('Query words:', queryWords);
    
    documents.forEach((doc, index) => {
        let relevanceScore = 0;
        let matchedContent = '';
        let matchDetails = [];
        
        // Search in various fields with detailed logging
        const searchFields = [
            { field: doc.name, weight: 3, name: 'name' },
            { field: doc.company, weight: 3, name: 'company' },
            { field: doc.content, weight: 1, name: 'content' },
            { field: JSON.stringify(doc.coverages || {}), weight: 2, name: 'coverages' },
            { field: (doc.additionalInsured || []).join(' '), weight: 2, name: 'additional_insured' }
        ];
        
        searchFields.forEach(({ field, weight, name }) => {
            if (field && typeof field === 'string') {
                const fieldLower = field.toLowerCase();
                
                // Check for exact query match
                if (fieldLower.includes(queryLower)) {
                    relevanceScore += weight * 2;
                    matchDetails.push(`${name}: exact match`);
                    
                    if (name === 'content') {
                        const startIndex = Math.max(0, fieldLower.indexOf(queryLower) - 50);
                        matchedContent = field.substring(startIndex, startIndex + 200) + '...';
                    }
                }
                
                // Check for individual word matches
                queryWords.forEach(word => {
                    if (fieldLower.includes(word)) {
                        relevanceScore += weight;
                        matchDetails.push(`${name}: contains '${word}'`);
                    }
                });
            }
        });
         if (relevanceScore > 0) {
            console.log(`Document ${index} (${doc.name}):`, {
                relevanceScore,
                matchDetails,
                hasMatchedContent: !!matchedContent
            });
            
            results.push({
                document: doc,
                relevanceScore,
                matchedContent: matchedContent || doc.content?.substring(0, 200) + '...' || 'No content preview available',
                matchDetails
            });
        }
    });
    
    const sortedResults = results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    console.log('Local search completed. Results found:', sortedResults.length);
    
    return sortedResults;
}

// Enhanced display function with debugging info
function displaySearchResults(results, query) {
    console.log('=== DISPLAYING SEARCH RESULTS ===');
    console.log('Results count:', results.length);
    console.log('Query:', query);
    
    if (results.length === 0) {
        console.log('No results to display, showing empty state');
        searchResults.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i data-lucide="search-x" style="width: 64px; height: 64px;"></i>
                </div>
                <div>No results found for "${query}"</div>
                <div style="margin-top: 1rem; opacity: 0.7; font-size: 14px;">
                    Try different keywords or check console for debug info
                </div>
                <div style="margin-top: 1rem; opacity: 0.5; font-size: 12px;">
                    Debug: Searched ${uploadedDocuments.length + sampleDocuments.length} documents
                </div>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }
    
    console.log('Generating HTML for results...');
    
    const resultsHTML = results.map((result, index) => {
        const doc = result.document;
        console.log(`Result ${index}:`, {
            name: doc.name,
            company: doc.company,
            relevanceScore: result.relevanceScore
        });
        
        const highlightedContent = result.matchedContent.replace(
            new RegExp(query.split(' ').join('|'), 'gi'),
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
                        Score: ${result.relevanceScore}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    searchResults.innerHTML = resultsHTML;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    console.log('Results displayed successfully');
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
    if (!documentList) return;
    
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
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Update AI insights
function updateAIInsights() {
    if (!aiInsights) return;
    
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
    
    const insightsList = document.getElementById('insightsList');
    if (insightsList) {
        insightsList.innerHTML = insightsHTML;
    }
    aiInsights.style.display = 'block';
}

// Loading and empty state functions
function showLoadingState() {
    if (loadingState) loadingState.classList.add('active');
    if (searchResults) searchResults.innerHTML = '';
}

function hideLoadingState() {
    if (loadingState) loadingState.classList.remove('active');
}

function showEmptyState() {
    if (!searchResults) return;
    
    searchResults.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <i data-lucide="search" style="width: 64px; height: 64px;"></i>
            </div>
            <div>Enter a search query to find information in your documents</div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Utility function
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}