// Sample document data// Sample document data
const documentData = {
    'abc-construction': {
        name: 'ABC Construction LLC',
        type: 'Certificate of Insurance',
        issueDate: 'January 15, 2024',
        expiryDate: 'January 15, 2025',
        insurer: 'Liberty Mutual Insurance',
        coverages: {
            'General Liability': '$2,000,000 per occurrence / $4,000,000 aggregate',
            'Workers Compensation': '$1,000,000 each accident',
            'Commercial Auto': '$1,000,000 combined single limit',
            'Umbrella': '$5,000,000 per occurrence'
        },
        additionalInsured: ['Property Owner LLC', 'General Contractor Inc'],
        description: 'Commercial general contractor specializing in residential and light commercial construction projects.'
    },
    'xyz-plumbing': {
        name: 'XYZ Plumbing Services',
        type: 'Certificate of Insurance',
        issueDate: 'February 1, 2024',
        expiryDate: 'February 1, 2025',
        insurer: 'State Farm Business',
        coverages: {
            'General Liability': '$1,000,000 per occurrence / $2,000,000 aggregate',
            'Workers Compensation': '$500,000 each accident',
            'Commercial Auto': '$1,000,000 combined single limit',
            'Professional Liability': '$2,000,000 per claim'
        },
        additionalInsured: ['Building Owner Corp', 'Property Management LLC'],
        description: 'Licensed plumbing contractor providing residential and commercial plumbing services including installation, repair, and maintenance.'
    },
    'tech-solutions': {
        name: 'Tech Solutions Inc',
        type: 'Certificate of Insurance',
        issueDate: 'January 1, 2024',
        expiryDate: 'December 31, 2024',
        insurer: 'Hartford Business Insurance',
        coverages: {
            'General Liability': '$3,000,000 per occurrence / $6,000,000 aggregate',
            'Professional Liability': '$5,000,000 per claim',
            'Cyber Liability': '$2,000,000 per incident',
            'Errors & Omissions': '$3,000,000 per claim'
        },
        additionalInsured: ['Client Corp', 'Technology Partners LLC'],
        description: 'IT consulting and managed services provider specializing in cloud infrastructure and cybersecurity solutions.'
    }
};

// Updated search result data with better formatting (updated to reflect only 3 vendors)
const searchResults = {
    'coverage-limits': {
        title: 'General Liability Coverage Analysis',
        summary: 'All 3 vendors meet minimum requirements with average coverage of $2M per occurrence',
        sections: [
            {
                title: '📊 Coverage Summary',
                items: [
                    { label: 'ABC Construction LLC', value: '$2M per occurrence / $4M aggregate', status: 'excellent', note: 'Well positioned for construction risks' },
                    { label: 'Tech Solutions Inc', value: '$3M per occurrence / $6M aggregate', status: 'excellent', note: 'Strong coverage for IT services' },
                    { label: 'XYZ Plumbing Services', value: '$1M per occurrence / $2M aggregate', status: 'adequate', note: 'Adequate for trade contractor' }
                ]
            },
            {
                title: '🎯 Key Insights',
                bullets: [
                    'Average coverage across portfolio: <strong>$2M per occurrence</strong>',
                    'All vendors exceed minimum requirement of $1M',
                    'Tech Solutions maintains highest limits appropriate for their risk profile',
                    'Coverage aligns well with industry standards'
                ]
            },
            {
                title: '💡 Recommendation',
                content: 'Consider requiring umbrella coverage for vendors with contracts exceeding $500K to provide additional protection above primary limits.'
            }
        ],
        source: 'Analysis of 3 active certificates • Generated in 0.8 seconds'
    },
    'expiring-certificates': {
        title: 'Certificate Expiration Analysis',
        summary: '1 certificate requires immediate attention, 2 renewals upcoming in next 90 days',
        sections: [
            {
                title: '🚨 Immediate Action Required',
                items: [
                    { 
                        label: 'Tech Solutions Inc', 
                        value: 'Expires December 31, 2024', 
                        status: 'urgent', 
                        note: '45 days remaining - High priority due to active $2.3M project'
                    }
                ]
            },
            {
                title: '📅 Upcoming Renewals (Next 90 Days)',
                items: [
                    { label: 'ABC Construction LLC', value: 'January 15, 2025', status: 'upcoming', note: '62 days remaining' },
                    { label: 'XYZ Plumbing Services', value: 'February 1, 2025', status: 'upcoming', note: '79 days remaining' }
                ]
            },
            {
                title: '✅ Renewal Management Status',
                bullets: [
                    'All vendors automatically notified 60 days prior to expiration',
                    'Tech Solutions Inc requires immediate follow-up (approaching 30-day critical window)',
                    'Professional liability and cyber coverage critical for Tech Solutions'
                ]
            },
            {
                title: '💡 Recommendation',
                content: 'Implement 90-day advance renewal notices for all technology vendors given their higher compliance requirements and longer underwriting timelines.'
            }
        ],
        source: 'Real-time expiration tracking • Updated daily'
    },
    'workers-comp': {
        title: 'Workers Compensation Coverage Review',
        summary: '2 of 3 vendors maintain WC coverage, 1 vendor below recommended minimums',
        sections: [
            {
                title: '🛡️ Coverage Details',
                items: [
                    { label: 'ABC Construction LLC', value: '$1M each accident', status: 'excellent', note: 'Excellent for construction class codes' },
                    { label: 'XYZ Plumbing Services', value: '$500K each accident', status: 'warning', note: 'Below recommended $1M minimum' },
                    { label: 'Tech Solutions Inc', value: 'No WC required', status: 'compliant', note: 'Professional services, independent contractors' }
                ]
            },
            {
                title: '⚠️ Risk Assessment',
                bullets: [
                    'Plumbing trade has <strong>3.2x higher injury rate</strong> than general contractors',
                    'XYZ Plumbing\'s $500K limit may expose gaps for serious workplace incidents',
                    'Current limits below industry standard for plumbing contractors'
                ]
            },
            {
                title: '✅ Compliance Status',
                content: '67% compliant - 2 out of 3 applicable vendors maintain active workers compensation coverage'
            },
            {
                title: '🎯 Action Required',
                content: 'Request XYZ Plumbing increase WC limits to $1M or provide experience modification rating to justify current limits.'
            }
        ],
        source: 'WC database cross-reference • Industry benchmarking included'
    },
    'additional-insured': {
        title: 'Additional Insured Status Verification',
        summary: '100% compliant - All vendors maintain proper additional insured endorsements',
        sections: [
            {
                title: '✅ Confirmed Additional Insured Status',
                items: [
                    { label: 'ABC Construction LLC', value: 'Property Owner LLC, General Contractor Inc', status: 'compliant' },
                    { label: 'XYZ Plumbing Services', value: 'Building Owner Corp, Property Management LLC', status: 'compliant' },
                    { label: 'Tech Solutions Inc', value: 'Client Corp, Technology Partners LLC', status: 'compliant' }
                ]
            },
            {
                title: '📋 Endorsement Analysis',
                bullets: [
                    'All policies include <strong>ongoing operations (CG 20 10)</strong> coverage',
                    'All policies include <strong>completed operations (CG 20 37)</strong> coverage',
                    'Primary and non-contributory language confirmed on all policies',
                    'Defense costs coverage included as required by vendor agreements'
                ]
            },
            {
                title: '🛡️ Coverage Scope',
                content: 'Additional insured status extends to all named entities for work performed under contract, including both liability and defense costs.'
            }
        ],
        source: 'Endorsement verification system • Legal compliance checked'
    },
    'coverage-gaps': {
        title: 'Coverage Gap and Exclusion Analysis',
        summary: '2 potential coverage gaps identified, standard exclusions noted',
        sections: [
            {
                title: '⚠️ Coverage Gaps Identified',
                items: [
                    { label: 'XYZ Plumbing Services', value: 'Workers Comp: $500K vs $1M recommended', status: 'warning', note: 'Below industry standard' },
                    { label: 'Tech Solutions Inc', value: 'Cyber Liability: $2M may be low for IT scope', status: 'caution', note: 'Consider increasing limits' }
                ]
            },
            {
                title: '📝 Standard Exclusions (Normal)',
                bullets: [
                    'Pollution exclusions on all general liability policies',
                    'Professional services exclusions on GL policies (covered separately)',
                    'Cyber/data breach exclusions on traditional policies'
                ]
            },
            {
                title: '🔮 Emerging Risk Considerations',
                bullets: [
                    'Climate-related property damage exposures',
                    'Supply chain disruption gaps',
                    'Cryptocurrency/digital asset exposures'
                ]
            },
            {
                title: '💡 Recommendations',
                content: '1. Require minimum $1M workers comp for trade contractors<br>2. Annual coverage adequacy reviews based on contract values<br>3. Consider master policy approach for high-volume vendors'
            }
        ],
        source: 'Comprehensive gap analysis • Industry risk benchmarking'
    },
    'umbrella-policies': {
        title: 'Umbrella and Excess Coverage Summary',
        summary: 'Only 33% of vendors maintain umbrella coverage, creating potential exposure gaps',
        sections: [
            {
                title: '☂️ Active Umbrella Policies',
                items: [
                    { 
                        label: 'ABC Construction LLC', 
                        value: '$5M umbrella over primary GL and auto', 
                        status: 'excellent', 
                        note: 'Includes contractual liability and additional insured coverage'
                    }
                ]
            },
            {
                title: '❌ No Umbrella Coverage',
                items: [
                    { label: 'Tech Solutions Inc', value: 'No umbrella policy identified', status: 'gap' },
                    { label: 'XYZ Plumbing Services', value: 'No umbrella policy identified', status: 'gap' }
                ]
            },
            {
                title: '📊 Risk Exposure Analysis',
                bullets: [
                    'Current aggregate exposure: <strong>~$6M across all vendors</strong>',
                    'Large loss scenarios (>$1M) could exhaust primary limits',
                    'Only 33% of portfolio maintains umbrella coverage'
                ]
            },
            {
                title: '🎯 Strategic Recommendations',
                content: '1. Require $5M umbrella for contracts exceeding $1M<br>2. Consider master umbrella policy for frequent vendors<br>3. Annual umbrella coverage reviews for risk adequacy<br>4. Negotiate shared umbrella programs for cost efficiency'
            }
        ],
        source: 'Umbrella coverage database • Risk modeling included'
    }
};

// Show document preview
function showDocumentPreview(docId) {
    const doc = documentData[docId];
    if (!doc) return;

    document.getElementById('modalTitle').textContent = doc.name + ' - Certificate Preview';
    
    const content = `
        <div class="data-section">
            <h4>📋 Certificate Information</h4>
            <div class="data-grid">
                <div class="data-item">
                    <div class="data-label">Document Type</div>
                    <div class="data-value">${doc.type}</div>
                </div>
                <div class="data-item">
                    <div class="data-label">Issue Date</div>
                    <div class="data-value">${doc.issueDate}</div>
                </div>
                <div class="data-item">
                    <div class="data-label">Expiry Date</div>
                    <div class="data-value">${doc.expiryDate}</div>
                </div>
                <div class="data-item">
                    <div class="data-label">Insurance Carrier</div>
                    <div class="data-value">${doc.insurer}</div>
                </div>
            </div>
        </div>

        <div class="data-section">
            <h4>🛡️ Coverage Details</h4>
            ${Object.entries(doc.coverages).map(([type, limit]) => `
                <div class="data-item" style="margin-bottom: 0.5rem;">
                    <div class="data-label">${type}</div>
                    <div class="data-value">${limit}</div>
                </div>
            `).join('')}
        </div>

        <div class="data-section">
            <h4>👥 Additional Insured Parties</h4>
            <div class="data-grid">
                ${doc.additionalInsured.map(party => `
                    <div class="data-item">
                        <div class="data-value">✅ ${party}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="data-section">
            <h4>📝 Business Description</h4>
            <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; line-height: 1.6;">
                ${doc.description}
            </div>
        </div>

        <div class="data-section">
            <h4>🤖 AI Extracted Insights</h4>
            <div style="background: rgba(48, 209, 88, 0.1); border: 1px solid rgba(48, 209, 88, 0.3); border-radius: 8px; padding: 1rem;">
                <div style="font-weight: 600; color: #30D158; margin-bottom: 0.5rem;">✅ Certificate Status: Active & Compliant</div>
                <div style="font-size: 14px; opacity: 0.9;">
                    • All required coverage types present<br>
                    • Additional insured endorsements verified<br>
                    • Primary & non-contributory language confirmed<br>
                    • Policy limits meet contract requirements
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('documentModal').classList.add('active');
}

// Close document preview
function closeDocumentPreview() {
    document.getElementById('documentModal').classList.remove('active');
}

// Updated function to display formatted search results
function showSearchResult(queryId) {
    const result = searchResults[queryId];
    if (!result) return;

    // Show loading state
    const loading = document.getElementById('loadingSearch');
    const results = document.getElementById('searchResults');
    
    loading.classList.add('active');
    results.classList.remove('active');

    // Simulate AI processing time
    setTimeout(() => {
        loading.classList.remove('active');
        
        // Build formatted result HTML
        let sectionsHTML = '';
        
        result.sections.forEach(section => {
            sectionsHTML += `<div class="result-section">`;
            sectionsHTML += `<h4 class="section-header">${section.title}</h4>`;
            
            if (section.items) {
                // Display items in a structured format
                section.items.forEach(item => {
                    const statusClass = getStatusClass(item.status);
                    sectionsHTML += `
                        <div class="result-item-row ${statusClass}">
                            <div class="item-label">${item.label}</div>
                            <div class="item-value">${item.value}</div>
                            ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
                        </div>
                    `;
                });
            } else if (section.bullets) {
                // Display bullet points
                sectionsHTML += `<ul class="result-bullets">`;
                section.bullets.forEach(bullet => {
                    sectionsHTML += `<li>${bullet}</li>`;
                });
                sectionsHTML += `</ul>`;
            } else if (section.content) {
                // Display content block
                sectionsHTML += `<div class="result-content-block">${section.content}</div>`;
            }
            
            sectionsHTML += `</div>`;
        });
        
        const resultHTML = `
            <div class="result-card formatted">
                <div class="result-title">
                    🧠 ${result.title}
                </div>
                <div class="result-summary">
                    ${result.summary}
                </div>
                <div class="result-sections">
                    ${sectionsHTML}
                </div>
                <div class="result-source">
                    ${result.source}
                </div>
            </div>
        `;
        
        results.innerHTML = resultHTML;
        results.classList.add('active');
        
        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 2000);
}

// Helper function to get status CSS class
function getStatusClass(status) {
    const statusMap = {
        'excellent': 'status-excellent',
        'adequate': 'status-adequate', 
        'warning': 'status-warning',
        'urgent': 'status-urgent',
        'upcoming': 'status-upcoming',
        'compliant': 'status-compliant',
        'caution': 'status-caution',
        'gap': 'status-gap'
    };
    return statusMap[status] || '';
}

// Close modal when clicking outside
document.getElementById('documentModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDocumentPreview();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDocumentPreview();
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('../index.html#')) {
            // Handle navigation to main page sections
            window.location.href = href;
        }
    });
});

// Add loading animations on page load
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.document-card, .search-question, .insight-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease-out forwards';
    });
});

// Add hover effects for better interactivity
document.querySelectorAll('.document-card, .search-question').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});