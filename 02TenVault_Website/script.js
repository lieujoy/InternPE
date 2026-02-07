// ============================================
// JQUERY SMOOTH SCROLLING & NAVIGATION
// ============================================
$(document).ready(function () {
  // Smooth scrolling for anchor links
  $("a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();

      var hash = this.hash;
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });

  // Product click handlers - navigate to product detail page
  const productData = [
    { selector: '.best-seller .best-p1:nth-child(1)', id: 'ben10-shoes-1' },
    { selector: '.best-seller .best-p1:nth-child(2)', id: 'ben10-tshirt-1' },
    { selector: '.best-seller .best-p1:nth-child(3)', id: 'ben10-tshirt-2' },
    { selector: '.best-seller .best-p1:nth-child(4)', id: 'ben10-crocs' }
  ];

  // Add second section products
  const productData2 = [
    { selector: '.seller:nth-child(2) .best-p1:nth-child(1)', id: 'ben10-playstation' },
    { selector: '.seller:nth-child(2) .best-p1:nth-child(2)', id: 'ben10-bag-1' },
    { selector: '.seller:nth-child(2) .best-p1:nth-child(3)', id: 'ben10-sunglass' },
    { selector: '.seller:nth-child(2) .best-p1:nth-child(4)', id: 'ben10-bag-2' }
  ];

  // Add third section products
  const productData3 = [
    { selector: '.seller:nth-child(3) .best-p1:nth-child(1)', id: 'ben10-slipper' },
    { selector: '.seller:nth-child(3) .best-p1:nth-child(2)', id: 'ben10-comics' },
    { selector: '.seller:nth-child(3) .best-p1:nth-child(3)', id: 'ben10-tshirt-black' },
    { selector: '.seller:nth-child(3) .best-p1:nth-child(4)', id: 'ben10-multi-bags' }
  ];

  // Combine all product data
  const allProducts = [...productData, ...productData2, ...productData3];

  // Add click handlers to all products
  allProducts.forEach(function (product) {
    $(product.selector).css('cursor', 'pointer').on('click', function (e) {
      // Don't navigate if clicking on Buy Now button
      if (!$(e.target).closest('.buy-now').length) {
        window.location.href = 'components/product-detail.html?id=' + product.id;
      }
    });

    // Update Buy Now buttons to go to product detail instead of #
    $(product.selector + ' .buy-now a').attr('href', 'components/product-detail.html?id=' + product.id);
  });

  // Close mobile menu when clicking on menu items
  $(".menu-items a").click(function () {
    $("#checkbox").prop("checked", false);
  });
});

// ============================================
// BACKGROUND MUSIC AUTOPLAY HANDLER
// ============================================
(function () {
  const bgm = document.getElementById('bgm');
  const hasPlayedKey = 'bgm_has_played';

  // Check if BGM has already been played in this session
  if (sessionStorage.getItem(hasPlayedKey)) {
    return; // Exit if already played
  }

  // Function to play BGM
  function playBGM() {
    bgm.play()
      .then(() => {
        console.log('BGM started playing');
        sessionStorage.setItem(hasPlayedKey, 'true');
        // Remove event listeners after successful play
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('keydown', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
      })
      .catch(error => {
        console.log('Autoplay blocked, waiting for user interaction:', error);
      });
  }

  // Function to play on user interaction
  function playOnInteraction() {
    bgm.play()
      .then(() => {
        console.log('BGM started playing after user interaction');
        sessionStorage.setItem(hasPlayedKey, 'true');
        // Remove all listeners after playing
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('keydown', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
      })
      .catch(error => {
        console.error('Failed to play BGM:', error);
      });
  }

  // Try to autoplay immediately
  playBGM();

  // Fallback: Add event listeners for user interaction
  document.addEventListener('click', playOnInteraction, { once: false });
  document.addEventListener('keydown', playOnInteraction, { once: false });
  document.addEventListener('touchstart', playOnInteraction, { once: false });
})();

// ============================================
// CART MANAGEMENT
// ============================================
// Update cart count on page load
function updateCartCount() {
  const cart = localStorage.getItem('cart');
  const cartArray = cart ? JSON.parse(cart) : [];
  const count = cartArray.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}
updateCartCount();

// ============================================
// NEWS SECTION - READ MORE/LESS
// ============================================
// Toggle Read More - Inline expansion
function toggleReadMore(link) {
  const newsText = link.previousElementSibling;
  const dots = newsText.querySelector('.dots');
  const moreText = newsText.querySelector('.more-text');

  if (moreText.style.display === 'none' || !moreText.style.display) {
    dots.style.display = 'none';
    moreText.style.display = 'inline';
    link.textContent = 'read less';
  } else {
    dots.style.display = 'inline';
    moreText.style.display = 'none';
    link.textContent = 'read more';
  }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.style.display = 'flex';
  } else {
    backToTopBtn.style.display = 'none';
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>
    <span>${message}</span>
  `;

  document.getElementById('toast-container').appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// LOADING SPINNER CONTROL
// ============================================
function showLoading() {
  document.getElementById('loading-spinner').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading-spinner').style.display = 'none';
}

// Hide loading on page load
window.addEventListener('load', () => {
  hideLoading();
});

// ============================================
// FORM VALIDATION
// ============================================
// Email validation for newsletter forms
const emailInputs = document.querySelectorAll('input[type="email"]');
emailInputs.forEach(input => {
  input.addEventListener('blur', function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
      this.style.borderColor = '#ff3333';
      showToast('Please enter a valid email address', 'error');
    } else {
      this.style.borderColor = '';
    }
  });
});

// ============================================
// SOCIAL SHARE FUNCTION
// ============================================
function shareProduct(title, text, url) {
  if (navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url
    }).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!', 'success');
  }
}