// js/home.js

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Native Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Offset for the fixed navigation bar
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // 2. Lightweight Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it enters the viewport
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the class that triggers the CSS transition
        entry.target.classList.add('is-visible');
        
        // Stop observing once the animation has triggered (runs only once)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply the observer to all elements with the .fade-in-up class
  const elementsToAnimate = document.querySelectorAll('.fade-in-up');
  elementsToAnimate.forEach((el) => {
    fadeObserver.observe(el);
  });

});

// كنسناو الصفحة تليشارجا كاملة
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        // ملي الكليان يكليكي على "ENVOYER"
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // هادي كتحبس الصفحة باش ماديرش ريفريش

            // 1. كنجبدو داكشي لي كتب الكليان
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            const submitBtn = document.getElementById('submitBtn');

            // 2. كنبينو ليه بلي راه خدامين باش يتسنى
            submitBtn.innerText = 'جاري الإرسال...';
            submitBtn.disabled = true;
            formMessage.style.display = 'none';

            try {
                // 3. كنصيفطو المعلومات للباكاند ديالنا لي صايبنا (بـ Fetch)
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, message })
                });

                // 4. كنتسناو الجواب ديال السيرفر
                const result = await response.json();

                // 5. كنبينو الميساج للكليان
                formMessage.style.display = 'block';
                if (result.success) {
                    formMessage.style.color = '#2ecc71'; // لون خضر
                    formMessage.innerText = result.message; // "تم الإرسال بنجاح..."
                    contactForm.reset(); // كنخويو الخانات
                } else {
                    formMessage.style.color = '#e74c3c'; // لون حمر
                    formMessage.innerText = result.message;
                }
            } catch (error) {
                formMessage.style.display = 'block';
                formMessage.style.color = '#e74c3c';
                formMessage.innerText = 'وقع خطأ فالاتصال بالسيرفر. عاود جرب.';
            } finally {
                // كنرجعو البوطونة كيف كانت فالأول
                submitBtn.innerHTML = 'ENVOYER &rarr;';
                submitBtn.disabled = false;
            }
        });
    }
});