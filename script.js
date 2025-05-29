let isLoginMode = true;

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
});