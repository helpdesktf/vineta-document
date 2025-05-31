$(document).ready(function () {
  const nav = $('#documenter_nav');
  const navanchors = nav.find('a[href^="#"]');
  const headerHeight = $('.header').outerHeight() || 0;
  let scrollTimeout;

  // Ẩn hết submenu, xóa class current lúc đầu
  nav.find('.submenu').hide();
  navanchors.removeClass('current');

  function scrollToTarget(id) {
    const target = $(id);
    if (target.length) {
      const top = target.offset().top - headerHeight;
      $('html, body').animate({ scrollTop: top }, 600, 'swing');
    }
  }

  function updateActiveLink(currentId) {
    if (!currentId) return;

    navanchors.removeClass('current');
    nav.find('.submenu').removeClass('show').slideUp(200);

    const currentLink = navanchors.filter('[href="#' + currentId + '"]');
    if (currentLink.length === 0) return;

    currentLink.addClass('current');

    const submenuDiv = currentLink.closest('.submenu');

    if (submenuDiv.length) {
      // Link con trong submenu
      submenuDiv.addClass('show').stop(true, true).slideDown(200);
      submenuDiv.parent().children('a.has-submenu').addClass('current');
    } else {
      // Link menu cha
      const possibleSubmenu = currentLink.next('.submenu');
      if (possibleSubmenu.length) {
        possibleSubmenu.addClass('show').stop(true, true).slideDown(200);
      }
    }

    // Đóng các submenu khác không liên quan
    nav.find('.submenu').not(submenuDiv).not(currentLink.next('.submenu')).removeClass('show').slideUp(200);
  }

  function getSections() {
    const selectors = 'section[id], article[id], h4[id]';
    const sections = [];
    $(selectors).each(function () {
      if ($(this).is(':visible')) {
        sections.push({
          id: this.id,
          offset: $(this).offset().top
        });
      }
    });
    return sections.sort((a, b) => a.offset - b.offset);
  }

  function findCurrentSection(sections) {
    const scrollPos = $(window).scrollTop() + headerHeight + 5;
    let currentId = null;
    for (let i = 0; i < sections.length; i++) {
      if (scrollPos >= sections[i].offset) {
        currentId = sections[i].id;
      } else {
        break;
      }
    }
    return currentId;
  }

  // Click menu/submenu
  navanchors.on('click', function (e) {
    e.preventDefault();
    const targetId = $(this).attr('href');
    scrollToTarget(targetId);
    updateActiveLink(targetId.substring(1));
  });

  // Toggle submenu khi click menu cha
  nav.on('click', 'a.has-submenu', function (e) {
    e.preventDefault();
    const submenu = $(this).next('.submenu');

    if (submenu.hasClass('show')) {
      submenu.removeClass('show').slideUp(200);
      $(this).removeClass('current');
    } else {
      nav.find('.submenu').removeClass('show').slideUp(200);
      nav.find('a.has-submenu').removeClass('current');
      submenu.addClass('show').slideDown(200);
      $(this).addClass('current');
    }
  });

  // Mở submenu khi hover menu cha
  nav.on('mouseenter', 'a.has-submenu', function () {
    const submenu = $(this).next('.submenu');
    if (!submenu.hasClass('show')) {
      nav.find('.submenu').not(submenu).removeClass('show').slideUp(200);
      nav.find('a.has-submenu').not(this).removeClass('current');
      submenu.addClass('show').stop(true, true).slideDown(200);
      $(this).addClass('current');
    }
  });
  // Ẩn submenu khi rời khỏi menu cha và submenu
  nav.on('mouseleave', 'div', function () {
    const submenu = $(this).children('.submenu');
    if (submenu.length) {
      submenu.removeClass('show').slideUp(200);
      $(this).children('a.has-submenu').removeClass('current');
    }
  });

  // Cập nhật active link khi scroll
  let sections = getSections();
  $(window).on('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const currentId = findCurrentSection(sections);
      if (currentId) {
        updateActiveLink(currentId);
      }
    }, 100);
  });

  // Khi resize có thể sections thay đổi vị trí, cập nhật lại
  $(window).on('resize', function () {
    sections = getSections();
  });

  // Trigger scroll ngay khi load
  $(window).trigger('scroll');

  // Xử lý hash khi load trang
  const hash = window.location.hash;
  if (hash && $(hash).length) {
    setTimeout(() => {
      scrollToTarget(hash);
      updateActiveLink(hash.substring(1));
    }, 300);
  } else {
    // Nếu không có hash, active menu đầu tiên
    if (sections.length) {
      updateActiveLink(sections[0].id);
    }
  }
});
