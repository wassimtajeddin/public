
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const button = contactForm?.querySelector('.submit-btn');
  const messageBox = document.getElementById('formMessage');

  if (contactForm) {

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = 'Sending...';

      const apiUrl = window.location.hostname === 'localhost' 
        ? '/api/contact' 
        : 'https://wassimtajeddin-github-io.onrender.com/api/contact';

      const formData = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        message: contactForm.message.value.trim()
      };

      if (!formData.name || !formData.email || !formData.message) {
        messageBox.textContent = 'Please fill in all fields.';
        messageBox.className = 'message error';
        button.disabled = false;
        button.textContent = originalText;
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        messageBox.textContent = 'Please enter a valid email address.';
        messageBox.className = 'message error';
        button.disabled = false;
        button.textContent = originalText;
        return;
      }

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && (result.success || result.msg)) {
          messageBox.textContent = result.msg || 'Message sent successfully!';
          messageBox.className = 'message success';
          contactForm.reset();
        } else {
          messageBox.textContent = result.msg || 'Something went wrong. Please try again.';
          messageBox.className = 'message error';
        }
      } catch (err) {
        console.error('Request failed:', err);
        messageBox.textContent = 'Failed to send message.';
        messageBox.className = 'message error';
      } finally {
        button.disabled = false;
        button.textContent = originalText;
        setTimeout(() => {
          messageBox.textContent = '';
          messageBox.className = 'message';
        }, 5000);
      }
    });
  }
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('section').forEach(function(section) {
    observer.observe(section);
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });

  const copyrightElement = document.querySelector('footer p');
  if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.innerHTML = `&copy; ${currentYear} Wassim Tajeddin. All rights reserved.`;
  }

  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });
});