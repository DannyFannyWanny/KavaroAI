// Add this to the TOP of both script.js files
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme from localStorage with consistent key
    const savedTheme = localStorage.getItem('kavaro-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
});

// Update your existing toggleTheme function to use consistent key
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('kavaro-theme', theme); // Use same key everywhere
}
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
        content: "This certificate evidences that ABC Construction LLC maintains the following insurance coverage. General Liability coverage with limits of $2,000,000 per occurrence and $4,000,000 aggregate. Workers Compensation coverage as required by law with limits of $1,000,000. Commercial Auto Liability coverage with combined single limit of $1,000,000. Umbrella coverage with limits of $5,000,000 per occurrence. Additional Insured status is provided to Property Owner LLC and General Contractor Inc as respects General Liability coverage."
    },
    {
        id: 2,
        name: "XYZ Logistics COI",
        type: "Certificate of Insurance",
        company: "XYZ Logistics Corp",
        issueDate: "2024-03-01",
        expiry: "2025-03-01",
        coverages: {
            "General Liability": "$1,000,000",
            "Commercial Auto": "$2,000,000",
            "Cargo": "$500,000",
            "Workers Compensation": "Statutory"
        },
        additionalInsured: ["Distribution Center LLC"],
        content: "Certificate of Insurance for XYZ Logistics Corp. General Liability insurance with $1,000,000 per occurrence limit and $2,000,000 general aggregate. Commercial Auto Liability coverage providing $2,000,000 combined single limit including owned, non-owned, and hired vehicles. Cargo Legal Liability coverage with $500,000 limit. Workers Compensation insurance providing statutory benefits as required by state law. Distribution Center LLC is named as Additional Insured on General Liability and Auto Liability policies."
    },
    {
        id: 3,
        name: "DEF Electrical COI",
        type: "Certificate of Insurance", 
        company: "DEF Electrical Services",
        issueDate: "2024-02-10",
        expiry: "2024-12-31",
        coverages: {
            "General Liability": "$2,000,000",
            "Professional Liability": "$1,000,000",
            "Workers Compensation": "$1,000,000",
            "Commercial Auto": "$1,000,000"
        },
        additionalInsured: ["Building Owner Corp", "Prime Contractor LLC"],
        content: "Insurance Certificate for DEF Electrical Services covering electrical contracting work. General Liability coverage provides $2,000,000 per occurrence and $4,000,000 aggregate with completed operations coverage. Professional Liability (Errors & Omissions) coverage with $1,000,000 per claim and aggregate limits. Workers Compensation coverage with $1,000,000 employer liability limits. Commercial Auto Liability with $1,000,000 combined single limit. Building Owner Corp and Prime Contractor LLC are Additional Insureds on the General Liability policy for work performed under contract."
    }
];

let uploadedDocuments = [];

// Initialize Lucide icons
lucide.createIcons();

// Theme toggle function
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
});

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

function processFiles(files) {
    files.forEach(file => {
        // Simulate file processing
        const doc = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type.includes('pdf') ? 'PDF Document' : 'Image Document',
            size: formatFileSize(file.size),
            uploadTime: new Date().toLocaleString(),
            processed: false
        };
        
        uploadedDocuments.push(doc);
        renderDocumentList();
        
        // Simulate AI processing
        setTimeout(() => {
            doc.processed = true;
            renderDocumentList();
            updateAIInsights();
        }, 2000 + Math.random() * 3000);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Load sample documents
loadSampleBtn.addEventListener('click', () => {
    uploadedDocuments = [...sampleDocuments];
    renderDocumentList();
    updateAIInsights();
    
    // Show success feedback
    loadSampleBtn.textContent = '✅ Sample Documents Loaded';
    setTimeout(() => {
        loadSampleBtn.textContent = '📄 Load Sample COI Documents';
    }, 2000);
});

function renderDocumentList() {
    if (uploadedDocuments.length === 0) {
        documentList.innerHTML = '';
        return;
    }

    documentList.innerHTML = uploadedDocuments.map(doc => `
        <div class="document-item">
            <div class="doc-icon">
                <i data-lucide="file-text" style="width: 20px; height: 20px;"></i>
            </div>
            <div class="doc-info">
                <div class="doc-name">${doc.name}</div>
                <div class="doc-details">
                    ${doc.company || doc.type} ${doc.processed !== undefined ? (doc.processed ? '• ✅ Processed' : '• ⏳ Processing...') : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// Search functionality
searchInput.addEventListener('input', debounce(handleSearch, 500));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Suggestion chips
document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        searchInput.value = chip.dataset.search;
        handleSearch();
    });
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleSearch() {
    const query = searchInput.value.trim();
    if (!query || uploadedDocuments.length === 0) {
        showEmptyState();
        return;
    }

    showLoadingState();
    
    // Simulate AI processing delay
    setTimeout(() => {
        const results = performSearch(query);
        displaySearchResults(results, query);
        hideLoadingState();
    }, 1500 + Math.random() * 1000);
}

function performSearch(query) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    uploadedDocuments.forEach(doc => {
        if (!doc.content) return;
        
        const content = doc.content.toLowerCase();
        let relevanceScore = 0;
        let snippets = [];
        
        // Simple keyword matching
        const queryWords = queryLower.split(' ');
        queryWords.forEach(word => {
            if (content.includes(word)) {
                relevanceScore += 1;
                
                // Find snippets around matches
                const index = content.indexOf(word);
                if (index !== -1) {
                    const start = Math.max(0, index - 50);
                    const end = Math.min(content.length, index + word.length + 50);
                    let snippet = doc.content.substring(start, end);
                    if (start > 0) snippet = "..." + snippet;
                    if (end < content.length) snippet = snippet + "...";
                    snippets.push(snippet);
                }
            }
        });
        
        // Special search logic for common insurance queries
        if (queryLower.includes('general liability') || queryLower.includes('liability')) {
            if (doc.coverages && doc.coverages['General Liability']) {
                relevanceScore += 3;
                snippets.unshift(`General Liability coverage: ${doc.coverages['General Liability']}`);
            }
        }
        
        if (queryLower.includes('workers comp') || queryLower.includes('workers compensation')) {
            if (doc.coverages && doc.coverages['Workers Compensation']) {
                relevanceScore += 3;
                snippets.unshift(`Workers Compensation coverage: ${doc.coverages['Workers Compensation']}`);
            }
        }
        
        if (queryLower.includes('expir') && doc.expiry) {
            relevanceScore += 2;
            const expiryDate = new Date(doc.expiry);
            const now = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
            snippets.unshift(`Certificate expires on ${doc.expiry} (${daysUntilExpiry} days from now)`);
        }
        
        if (queryLower.includes('additional insured') && doc.additionalInsured) {
            relevanceScore += 2;
            snippets.unshift(`Additional Insureds: ${doc.additionalInsured.join(', ')}`);
        }
        
        if (queryLower.includes('umbrella') && doc.coverages && doc.coverages['Umbrella']) {
            relevanceScore += 3;
            snippets.unshift(`Umbrella coverage: ${doc.coverages['Umbrella']}`);
        }
        
        if (relevanceScore > 0) {
            results.push({
                document: doc,
                relevanceScore,
                snippets: snippets.slice(0, 3) // Top 3 snippets
            });
        }
    });
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i data-lucide="search-x" style="width: 64px; height: 64px;"></i>
                </div>
                <div>No results found for "${query}"</div>
                <div style="margin-top: 0.5rem; opacity: 0.7;">Try different keywords or upload more documents</div>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    searchResults.innerHTML = results.map(result => {
        const doc = result.document;
        const highlightedSnippets = result.snippets.map(snippet => 
            highlightKeywords(snippet, query)
        );

        return `
            <div class="result-item">
                <div class="result-title">${doc.name}</div>
                <div class="result-snippet">
                    ${highlightedSnippets.join('<br><span style="opacity: 0.6;">• </span>')}
                </div>
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
    
    lucide.createIcons();
}

function highlightKeywords(text, query) {
    const words = query.toLowerCase().split(' ');
    let highlightedText = text;
    
    words.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
    });
    
    return highlightedText;
}

function showLoadingState() {
    loadingState.classList.add('active');
    searchResults.style.display = 'none';
}

function hideLoadingState() {
    loadingState.classList.remove('active');
    searchResults.style.display = 'block';
}

function showEmptyState() {
    hideLoadingState();
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

function updateAIInsights() {
    if (uploadedDocuments.length === 0) {
        aiInsights.style.display = 'none';
        return;
    }

    const insights = generateInsights(uploadedDocuments);
    
    document.getElementById('insightsList').innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-icon ${insight.type}">
                <i data-lucide="${insight.icon}" style="width: 16px; height: 16px;"></i>
            </div>
            <div>${insight.text}</div>
        </div>
    `).join('');
    
    aiInsights.style.display = 'block';
    lucide.createIcons();
}

function generateInsights(documents) {
    const insights = [];
    
    // Check for expiring certificates
    const expiringSoon = documents.filter(doc => {
        if (!doc.expiry) return false;
        const expiryDate = new Date(doc.expiry);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 90;
    });
    
    if (expiringSoon.length > 0) {
        insights.push({
            type: 'insight-expiry',
            icon: 'alert-triangle',
            text: `${expiringSoon.length} certificate(s) expire within 90 days - renewal required`
        });
    }
    
    // Check coverage patterns
    const totalDocs = documents.length;
    const withUmbrella = documents.filter(doc => doc.coverages && doc.coverages['Umbrella']).length;
    const umbrellaPercentage = Math.round((withUmbrella / totalDocs) * 100);
    
    if (umbrellaPercentage < 50) {
        insights.push({
            type: 'insight-risk',
            icon: 'shield-alert',
            text: `Only ${umbrellaPercentage}% of certificates include umbrella coverage - consider requiring higher limits`
        });
    }
    
    // Check for consistent additional insured
    const withAdditionalInsured = documents.filter(doc => doc.additionalInsured && doc.additionalInsured.length > 0).length;
    const additionalInsuredPercentage = Math.round((withAdditionalInsured / totalDocs) * 100);
    
    if (additionalInsuredPercentage === 100) {
        insights.push({
            type: 'insight-coverage',
            icon: 'check-circle',
            text: 'All certificates properly name additional insureds - excellent compliance'
        });
    } else {
        insights.push({
            type: 'insight-risk',
            icon: 'alert-circle',
            text: `${100 - additionalInsuredPercentage}% of certificates missing additional insured requirements`
        });
    }
    
    // Coverage adequacy check
    const lowLiability = documents.filter(doc => {
        if (!doc.coverages || !doc.coverages['General Liability']) return false;
        const amount = doc.coverages['General Liability'];
        const numericAmount = parseFloat(amount.replace(/[$,]/g, ''));
        return numericAmount < 2000000; // Less than $2M
    }).length;
    
    if (lowLiability > 0) {
        insights.push({
            type: 'insight-risk',
            icon: 'trending-down',
            text: `${lowLiability} certificate(s) have General Liability coverage below $2M industry standard`
        });
    }
    
    return insights;
}