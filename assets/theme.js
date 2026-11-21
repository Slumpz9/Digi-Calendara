(function () {
  'use strict';

  var theme = window.theme || { routes: {}, strings: {} };

  /* ---------- Header menus ---------- */

  function initMenus() {
    var menus = document.querySelectorAll('[data-menu-drawer], [data-dropdown]');

    document.addEventListener('click', function (event) {
      menus.forEach(function (menu) {
        if (menu.open && !menu.contains(event.target)) menu.open = false;
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      menus.forEach(function (menu) {
        if (!menu.open) return;
        menu.open = false;
        var summary = menu.querySelector('summary');
        if (summary) summary.focus();
      });
    });
  }

  /* ---------- Quantity steppers ---------- */

  function initQuantity() {
    document.addEventListener('click', function (event) {
      var button = event.target.closest('[data-quantity-step]');
      if (!button) return;
      var input = button.closest('[data-quantity]').querySelector('input');
      var min = Number(input.min || 0);
      var next = Math.max(min, (Number(input.value) || 0) + Number(button.dataset.quantityStep));
      if (next === Number(input.value)) return;
      input.value = next;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  /* ---------- Cart ---------- */

  function setCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (bubble) {
      bubble.textContent = count;
      bubble.hidden = count === 0;
    });
  }

  var toastTimer;

  function showToast(message, linkLabel, linkUrl) {
    var toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.textContent = message;
    if (linkLabel && linkUrl) {
      var link = document.createElement('a');
      link.href = linkUrl;
      link.textContent = linkLabel;
      toast.appendChild(link);
    }
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.hidden = true;
    }, 6000);
  }

  function initCartForm() {
    var form = document.querySelector('[data-cart-form]');
    if (!form) return;
    var timer;
    form.addEventListener('change', function (event) {
      if (!event.target.matches('input[name="updates[]"]')) return;
      clearTimeout(timer);
      timer = setTimeout(function () {
        form.submit();
      }, 500);
    });
  }

  /* ---------- Product page ---------- */

  function initProduct(root) {
    var form = root.querySelector('[data-product-form]');
    var picker = root.querySelector('[data-variant-picker]');
    var variants = [];

    if (picker) {
      try {
        variants = JSON.parse(picker.querySelector('[data-variants]').textContent);
      } catch (error) {
        variants = [];
      }
      picker.addEventListener('change', onVariantChange);
    }

    root.addEventListener('click', function (event) {
      var thumb = event.target.closest('[data-thumb]');
      if (thumb) showMedia(thumb.dataset.thumb);
    });

    if (form) form.addEventListener('submit', onSubmit);

    function showMedia(id) {
      if (!root.querySelector('[data-media-id="' + id + '"]')) return;
      root.querySelectorAll('[data-media-id]').forEach(function (slide) {
        slide.classList.toggle('is-active', slide.dataset.mediaId === String(id));
      });
      root.querySelectorAll('[data-thumb]').forEach(function (thumb) {
        thumb.classList.toggle('is-active', thumb.dataset.thumb === String(id));
      });
    }

    function onVariantChange() {
      var selected = [];
      picker.querySelectorAll('input:checked').forEach(function (input) {
        selected[Number(input.dataset.optionPosition) - 1] = input.value;
      });

      var variant = variants.find(function (candidate) {
        return candidate.options.every(function (value, index) {
          return value === selected[index];
        });
      });

      var addButton = root.querySelector('[data-add]');
      var idInput = root.querySelector('[data-variant-id]');

      if (!variant) {
        if (addButton) {
          addButton.disabled = true;
          addButton.textContent = addButton.dataset.unavailable || addButton.textContent;
        }
        return;
      }

      if (idInput) idInput.value = variant.id;
      if (variant.featured_media) showMedia(variant.featured_media.id);

      var url = root.dataset.url + '?variant=' + variant.id;
      window.history.replaceState({}, '', url);

      fetch(url + '&section_id=' + root.dataset.sectionId)
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          var fresh = new DOMParser().parseFromString(html, 'text/html');
          var freshPrice = fresh.querySelector('[data-price]');
          var freshAdd = fresh.querySelector('[data-add]');
          var price = root.querySelector('[data-price]');
          if (price && freshPrice) price.innerHTML = freshPrice.innerHTML;
          if (addButton && freshAdd) {
            addButton.disabled = freshAdd.disabled;
            addButton.textContent = freshAdd.textContent.trim();
          }
        })
        .catch(function () {
          if (addButton) addButton.disabled = !variant.available;
        });
    }

    function onSubmit(event) {
      if (!window.fetch || !theme.routes.cart_add_url) return;
      event.preventDefault();

      var button = form.querySelector('[data-add]');
      var errorBox = form.querySelector('[data-form-error]');
      if (errorBox) errorBox.hidden = true;
      if (button) button.setAttribute('aria-busy', 'true');

      fetch(theme.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: new FormData(form)
      })
        .then(function (response) {
          return response.json().then(function (data) {
            if (!response.ok) throw new Error(data.description || data.message || theme.strings.error);
            return data;
          });
        })
        .then(function () {
          return fetch(theme.routes.cart_url + '.js', { headers: { Accept: 'application/json' } });
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (cart) {
          setCartCount(cart.item_count);
          showToast(theme.strings.added, theme.strings.view_cart, theme.routes.cart_url);
        })
        .catch(function (error) {
          if (errorBox) {
            errorBox.textContent = error.message || theme.strings.error;
            errorBox.hidden = false;
          }
        })
        .then(function () {
          if (button) button.removeAttribute('aria-busy');
        });
    }
  }

  /* ---------- Collection sorting ---------- */

  function initSort() {
    var select = document.querySelector('[data-sort]');
    if (!select) return;
    select.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', select.value);
      url.searchParams.delete('page');
      window.location.assign(url.toString());
    });
  }

  function init() {
    initMenus();
    initQuantity();
    initCartForm();
    initSort();
    document.querySelectorAll('[data-product]').forEach(initProduct);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Re-run in the theme editor when a section is added or re-rendered. */
  document.addEventListener('shopify:section:load', function (event) {
    event.target.querySelectorAll('[data-product]').forEach(initProduct);
  });
})();
