let isLoginMode = true;

// Mobile menu toggle function
function toggleMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    const button = document.querySelector('.mobile-menu-btn');
    
    if (overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        button.classList.remove('active');
        document.body.style.overflow = 'auto';
    } else {
        overlay.classList.add('active');
        button.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Smooth scroll function
function scrollToSection(elementId) {
   const element = document.getElementById(elementId);
   if (element) {
       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }
}

// Modal functions
function openModal() {
   document.getElementById('loginModal').classList.add('active');
}

function closeModal() {
   document.getElementById('loginModal').classList.remove('active');
}

function toggleLoginMode() {
   isLoginMode = !isLoginMode;
   const nameGroup = document.getElementById('nameGroup');
   const modalTitle = document.getElementById('modalTitle');
   const modalSubtitle = document.getElementById('modalSubtitle');
   const submitBtn = document.getElementById('submitBtn');
   const switchBtn = document.getElementById('switchBtn');
   
   if (isLoginMode) {
       nameGroup.style.display = 'none';
       modalTitle.textContent = 'Welcome Back';
       modalSubtitle.textContent = 'Sign in to your Kavaro AI dashboard';
       submitBtn.textContent = 'Sign In';
       switchBtn.textContent = "Don't have an account? Sign up";
   } else {
       nameGroup.style.display = 'block';
       modalTitle.textContent = 'Get Started';
       modalSubtitle.textContent = 'Create your account to start your free trial';
       submitBtn.textContent = 'Start Trial';
       switchBtn.textContent = 'Already have an account? Sign in';
   }
}

// Form handlers
function handleEmailSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-input').value;
    const submitBtn = document.querySelector('.cta-submit');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Use XMLHttpRequest instead of fetch
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://sheetdb.io/api/v1/ucgaugwtjn4xz', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 201) {
                alert('✅ Thank you! We\'ll be in touch soon.');
                document.getElementById('email-input').value = '';
            } else {
                console.error('Error:', xhr.status, xhr.responseText);
                alert('❌ Something went wrong. Please try again.');
            }
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    };
    
    const data = JSON.stringify({
        Email: email,
        Timestamp: new Date().toLocaleString(),
        Source: 'Kavaro Landing Page'
    });
    
    xhr.send(data);
}

// Stakeholder Flow Interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Add stakeholder node interactions
    const stakeholderNodes = document.querySelectorAll('.stakeholder-node');
    
    stakeholderNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        
        node.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
    });
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
   // Login form handler
   document.getElementById('loginForm').addEventListener('submit', function(event) {
       event.preventDefault();
       const email = document.getElementById('emailInput').value;
       const action = isLoginMode ? 'Logging in' : 'Creating account';
       
       alert(`${action}... Welcome to Kavaro AI! 🎉\n\nRedirecting to dashboard...`);
       closeModal();
       
       setTimeout(() => {
           alert('Dashboard loading... (This is where your actual app would be!)');
       }, 1000);
   });

   // Close modal when clicking outside
   document.getElementById('loginModal').addEventListener('click', function(event) {
       if (event.target === this) {
           closeModal();
       }
   });
   
   // Close mobile menu when clicking outside
   document.getElementById('mobileMenuOverlay').addEventListener('click', function(event) {
       if (event.target === this) {
           toggleMobileMenu();
       }
   });
   
   // Close mobile menu on escape key
   document.addEventListener('keydown', function(event) {
       if (event.key === 'Escape' && document.getElementById('mobileMenuOverlay').classList.contains('active')) {
           toggleMobileMenu();
       }
   });
});

// Stakeholder Details Modal Functions
function showStakeholderDetails(stakeholderType) {
    const modal = document.getElementById('stakeholderModal');
    const icon = document.getElementById('stakeholderIcon');
    const title = document.getElementById('stakeholderTitle');
    const subtitle = document.getElementById('stakeholderSubtitle');
    const content = document.getElementById('stakeholderContent');
    
    // Stakeholder data
    const stakeholderData = {
        underwriters: {
            icon: '📊',
            iconClass: 'underwriter',
            title: 'Underwriters',
            subtitle: 'Risk evaluation & pricing',
            content: `
                <strong>Key Documents:</strong>
                Exposure schedules, applications, loss runs, COIs, risk narratives, claims history
                <br><br>
                <strong>Lifecycle:</strong>
                Submission review → Risk analysis → Policy pricing & binding
            `
        },
        compliance: {
            icon: '⚖️',
            iconClass: 'compliance',
            title: 'Compliance / Legal / EHS',
            subtitle: 'Risk accountability & defense',
            content: `
                <strong>Key Documents:</strong>
                Risk registers, incident reports, OSHA docs, contract language, audit logs
                <br><br>
                <strong>Lifecycle:</strong>
                Policy review → Risk mitigation → Audit prep → Legal response & claims analysis
            `
        },
        brokers: {
            icon: '🤝',
            iconClass: 'broker',
            title: 'Insurance Brokers',
            subtitle: 'Submissions & client support',
            content: `
                <strong>Key Documents:</strong>
                Client intake forms, COIs, policy binders, endorsements, renewal packets
                <br><br>
                <strong>Lifecycle:</strong>
                Client onboarding → Submission packaging → Renewals & retention
            `
        },
        clients: {
            icon: '🏢',
            iconClass: 'client',
            title: 'Clients / Insureds',
            subtitle: 'Risk, Ops, HR, Legal teams',
            content: `
                <strong>Key Documents:</strong>
                Insurance policies, contracts, COIs, premium invoices, claims, safety reports
                <br><br>
                <strong>Lifecycle:</strong>
                Policy intake → Document management → Expiration tracking → Claims support
            `
        },
        vendors: {
            icon: '👷',
            iconClass: 'vendor',
            title: 'Vendors / Subcontractors',
            subtitle: 'Proving compliance to clients',
            content: `
                <strong>Key Documents:</strong>
                COIs, additional insured endorsements, contracts, safety plans, certifications
                <br><br>
                <strong>Lifecycle:</strong>
                Vendor onboarding → Document upload → Renewal submissions → Compliance tracking
            `
        },
        kavaro: {
            icon: '🧠',
            iconClass: 'kavaro-hub',
            title: 'Kavaro AI',
            subtitle: 'The Risk Management Bridge',
            content: `
                <strong>Core Features:</strong>
                • AI Document Intelligence<br>
                • Secure Storage & Audit Trail<br>
                • Real-time Collaboration<br>
                • Automated Compliance<br>
                • Predictive Risk Analytics
                <br><br>
                <strong>How It Works:</strong>
                Kavaro AI connects every stakeholder, every document, and every risk obligation across the full insurance lifecycle, transforming unstructured data into actionable intelligence.
            `
        }
    };
    
    const data = stakeholderData[stakeholderType];
    if (data) {
        // Set icon
        icon.textContent = data.icon;
        icon.className = `stakeholder-modal-icon ${data.iconClass}`;
        
        // Set content
        title.textContent = data.title;
        subtitle.textContent = data.subtitle;
        content.innerHTML = data.content;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeStakeholderModal() {
    const modal = document.getElementById('stakeholderModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close stakeholder modal on escape key or outside click
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('stakeholderModal');
    
    // Close on outside click
    modal.addEventListener('click', function(event) {
        if (event.target === this) {
            closeStakeholderModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeStakeholderModal();
        }
    });
});