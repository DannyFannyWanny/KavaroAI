// Sample document data
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
    },
    'green-landscaping': {
        name: 'Green Landscaping Co',
        type: 'Certificate of Insurance',
        issueDate: 'March 20, 2024',
        expiryDate: 'March 20, 2025',
        insurer: 'Farmers Business Insurance',
        coverages: {
            'General Liability': '$1,000,000 per occurrence / $2,000,000 aggregate',
            'Commercial Auto': '$500,000 combined single limit',
            'Workers Compensation': '$1,000,000 each accident',
            'Equipment Coverage': '$250,000 replacement cost'
        },
        additionalInsured: ['Property Management Inc', 'HOA Services LLC'],
        description: 'Full-service landscaping company providing design, installation, and maintenance services for commercial and residential properties.'
    }
};

// Search result data
const searchResults = {
    'coverage-limits': {
        title: 'General Liability Coverage Analysis',
        content: `Based on my analysis of your current Certificate of Insurance portfolio, here's a comprehensive breakdown of general liability coverage limits:

**Coverage Summary:**
• ABC Construction LLC: <span class="highlight">$2M per occurrence / $4M aggregate</span> - Well positioned for construction risks
• XYZ Plumbing Services: <span class="highlight">$1M per occurrence / $2M aggregate</span> - Adequate for trade contractor
• Tech Solutions Inc: <span class="highlight">$3M per occurrence / $6M aggregate</span> - Strong coverage for IT services
• Green Landscaping Co: <span class="highlight">$1M per occurrence / $2M aggregate</span> - Standard for landscaping operations

**Key Insights:**
The average coverage across your vendor portfolio is $1.75M per occurrence, which aligns well with industry standards. Tech Solutions Inc maintains the highest limits at $3M, appropriate for their technology services exposure. All vendors meet your minimum requirements of $1M per occurrence.

**Recommendation:** Consider requiring umbrella coverage for vendors with contracts exceeding $500K to provide additional protection above primary limits.`,
        source: 'Analysis of 4 active certificates • Generated in 0.8 seconds'
    },
    'expiring-certificates': {
        title: 'Certificate Expiration Analysis',
        content: `I've identified upcoming certificate expirations within your 90-day renewal window:

**Immediate Action Required:**
• <span class="highlight">Tech Solutions Inc</span> - Expires December 31, 2024 (45 days remaining)
  - High priority renewal due to active $2.3M project
  - Professional liability and cyber coverage critical

**Upcoming Renewals:**
• ABC Construction LLC - Expires January 15, 2025 (62 days remaining)
• XYZ Plumbing Services - Expires February 1, 2025 (79 days remaining)

**Renewal Management:**
All vendors have been automatically notified 60 days prior to expiration. Tech Solutions Inc requires immediate follow-up as they're approaching the 30-day critical window.

**Recommendation:** Implement 90-day advance renewal notices for all technology vendors given their higher compliance requirements and longer underwriting timelines.`,
        source: 'Real-time expiration tracking • Updated daily'
    },
    'workers-comp': {
        title: 'Workers Compensation Coverage Review',
        content: `Here's a detailed analysis of workers compensation coverage across your vendor network:

**Coverage Details:**
• ABC Construction LLC: <span class="highlight">$1M each accident</span> - Excellent for construction class codes
• XYZ Plumbing Services: <span class="highlight">$500K each accident</span> - Below recommended minimums
• Green Landscaping Co: <span class="highlight">$1M each accident</span> - Appropriate for landscaping operations
• Tech Solutions Inc: <span class="highlight">No WC required</span> - Professional services, independent contractors

**Compliance Analysis:**
3 out of 4 applicable vendors maintain active workers compensation coverage. XYZ Plumbing's $500K limit falls below the recommended $1M minimum for plumbing contractors due to higher injury frequency rates in this trade.

**Risk Assessment:**
The plumbing trade has a 3.2x higher injury rate than general contractors. Current limits may expose you to potential gaps in coverage for serious workplace incidents.

**Action Item:** Request XYZ Plumbing increase WC limits to $1M or provide certificate of experience modification rating to justify current limits.`,
        source: 'WC database cross-reference • Industry benchmarking included'
    },
    'additional-insured': {
        title: 'Additional Insured Status Verification',
        content: `I've verified additional insured endorsements across all active certificates:

**Confirmed Additional Insured Status:**
• ABC Construction LLC: ✅ <span class="highlight">Property Owner LLC, General Contractor Inc</span>
• XYZ Plumbing Services: ✅ <span class="highlight">Building Owner Corp, Property Management LLC</span>
• Tech Solutions Inc: ✅ <span class="highlight">Client Corp, Technology Partners LLC</span>
• Green Landscaping Co: ✅ <span class="highlight">Property Management Inc, HOA Services LLC</span>

**Endorsement Analysis:**
All vendors maintain proper additional insured endorsements with both ongoing operations (CG 20 10) and completed operations (CG 20 37) coverage. Primary and non-contributory language is confirmed on all policies.

**Coverage Scope:**
Additional insured status extends to all named entities for work performed under contract. Coverage includes both liability and defense costs as required by your vendor agreements.

**Compliance Status:** <span class="highlight">100% compliant</span> - All required additional insured endorsements are active and properly documented.`,
        source: 'Endorsement verification system • Legal compliance checked'
    },
    'coverage-gaps': {
        title: 'Coverage Gap and Exclusion Analysis',
        content: `I've identified several coverage considerations and potential gaps in your vendor portfolio:

**Coverage Gaps Identified:**
• <span class="highlight">XYZ Plumbing Services:</span> Workers comp limits below industry standard ($500K vs recommended $1M)
• <span class="highlight">Green Landscaping Co:</span> Auto liability limits may be insufficient for fleet operations
• <span class="highlight">Tech Solutions Inc:</span> Cyber liability at $2M may be low for IT service scope

**Notable Exclusions:**
• Pollution exclusions on all general liability policies (standard)
• Professional services exclusions on GL policies (covered separately where applicable)
• Cyber/data breach exclusions on traditional policies (separate cyber coverage recommended)

**Emerging Risks:**
• Climate-related property damage (consider separate environmental coverage)
• Supply chain disruption (business interruption coverage gaps)
• Cryptocurrency/digital asset exposures (emerging coverage area)

**Recommendations:**
1. Require minimum $1M workers comp for all trade contractors
2. Annual coverage adequacy reviews based on contract values
3. Consider master policy approach for high-volume vendors`,
        source: 'Comprehensive gap analysis • Industry risk benchmarking'
    },
    'umbrella-policies': {
        title: 'Umbrella and Excess Coverage Summary',
        content: `Here's your current umbrella and excess liability coverage landscape:

**Active Umbrella Policies:**
• ABC Construction LLC: <span class="highlight">$5M umbrella</span> over primary GL and auto
  - Follows form coverage with $10K self-insured retention
  - Includes contractual liability and additional insured coverage

**Excess Coverage Analysis:**
• Tech Solutions Inc: No umbrella policy identified
• XYZ Plumbing Services: No umbrella policy identified  
• Green Landscaping Co: No umbrella policy identified

**Coverage Assessment:**
Only 25% of your vendor portfolio maintains umbrella coverage. This creates potential gaps for large loss scenarios that exceed primary policy limits.

**Risk Exposure:**
Current aggregate exposure without umbrella coverage is approximately $8M across all vendors. Large loss scenarios (>$1M) could exhaust primary limits, creating coverage gaps.

**Strategic Recommendations:**
1. Require $5M umbrella for contracts exceeding $1M
2. Consider master umbrella policy for frequent vendors
3. Annual umbrella coverage reviews for risk adequacy
4. Negotiate shared umbrella programs for cost efficiency`,
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

// Show search results
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
        
        const resultHTML = `
            <div class="result-card">
                <div class="result-title">
                    🧠 ${result.title}
                </div>
                <div class="result-content">
                    ${result.content}
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