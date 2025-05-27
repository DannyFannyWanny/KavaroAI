let isLoginMode = true;
// Smooth scroll function
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
}
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
async function handleEmailSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-input').value;
    const submitBtn = document.querySelector('.cta-submit');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('https://sheetdb.io/api/v1/ucgaugwtjn4xz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: email,
                Timestamp: new Date().toLocaleString(),
                Source: 'Kavaro Landing Page'
            })
        });
        
        if (response.ok) {
            alert('✅ Thank you! We\'ll be in touch soon.');
            document.getElementById('email-input').value = '';
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Something went wrong. Please try again.');
    }
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}
// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme'); // Ensure dark mode is default
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
   initTheme();
   
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