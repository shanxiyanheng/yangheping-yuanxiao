/* 杨和平元宵 · 官网交互 */
(function () {
  'use strict';

  // 移动端导航
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.textContent = '☰';
      }
    });
  }

  // 滚动显现
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // 页头滚动阴影
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 40 ? '0 6px 30px rgba(0,0,0,0.35)' : 'none';
    }, { passive: true });
  }

  // 留言表单 —— FormSubmit 邮箱收信
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var tip = document.getElementById('formTip');
      var originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = '正在提交…';
      if (tip) { tip.textContent = ''; }
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (!res.ok) { throw new Error('submit-failed'); }
        form.innerHTML =
          '<div class="form-success">' +
          '<span class="form-success-icon">✓</span>' +
          '<h3>留言已送达</h3>' +
          '<p>感谢您的信任与留言！我们已经收到您的信息，会尽快通过电话或邮箱与您联系。</p>' +
          '<p class="form-success-sub">如需即时咨询，请直接拨打热线 15319062125</p>' +
          '</div>';
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = originalText;
        if (tip) {
          tip.textContent = '抱歉，留言发送失败，请稍后重试，或直接拨打热线 15319062125。';
          tip.style.color = '#7a1f1f';
        }
      });
    });
  }
})();
