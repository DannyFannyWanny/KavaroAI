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
   openModal();
}

// Initialize theme on page load
function initTheme() {
   const savedTheme = localStorage.getItem('theme');
   const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
   const theme = savedTheme || (prefersDark ? 'dark' : 'light');
   
   if (theme === 'light') {
       document.body.classList.add('light-theme');
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