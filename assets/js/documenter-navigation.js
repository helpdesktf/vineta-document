$(document).ready(function () {
  const nav = $('#documenter_nav');
  const navanchors = nav.find('a[href^="#"]');
  const headerHeight = $('.header').height() || 0;
  let scrollTimeout;

  function scrollToTarget(id) {
    const target = $(id);
    if (target.length) {
      const top = target.offset().top - headerHeight;
      $('html, body').animate({ scrollTop: top }, 600, 'swing');
    }
  }

  function updateActiveLink(currentId) {
    // Reset tất cả trạng thái
    navanchors.removeClass('current');
    nav.find('a.has-submenu').removeClass('current');
    nav.find('.submenu').removeClass('show').slideUp(200);

    const currentLink = navanchors.filter('[href="#' + currentId + '"]');
    if (currentLink.length === 0) return;

    currentLink.addClass('current');

    const submenuDiv = currentLink.closest('.submenu');
    if (submenuDiv.length) {
      // Link nằm trong submenu
      submenuDiv.addClass('show').stop(true, true).slideDown(200);
      submenuDiv.parent().children('a.has-submenu').addClass('current');
    } else {
      // Link là menu cha
      const possibleSubmenu = currentLink.next('.submenu');
      if (possibleSubmenu.length) {
        possibleSubmenu.addClass('show').stop(true, true).slideDown(200);
      }
    }

    // Đóng các submenu khác không liên quan
    nav.find('.submenu')
      .not(submenuDiv)
      .not(currentLink.next('.submenu'))
      .removeClass('show')
      .slideUp(200);
  }

  function getSections() {
    const sections = [];
    $('section[id], article[id], h4[id]').each(function () {
      sections.push({
        id: this.id,
        offset: $(this).offset().top
      });
    });
    return sections.sort((a, b) => a.offset - b.offset);
  }

  function findCurrentSection(sections) {
    const scrollPos = $(window).scrollTop() + headerHeight + 10;
    for (let i = sections.length - 1; i >= 0; i--) {
      if (scrollPos >= sections[i].offset) {
        return sections[i].id;
      }
    }
    return null;
  }

  // Xử lý click vào menu / submenu
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

    const isOpen = submenu.hasClass('show');

    // Reset toàn bộ
    nav.find('a.has-submenu').removeClass('current');
    nav.find('.submenu').removeClass('show').slideUp(200);

    // Nếu chưa mở thì mở
    if (!isOpen) {
      submenu.addClass('show').slideDown(200);
      $(this).addClass('current');
    }
  });

  // Hiển thị submenu khi hover (tuỳ chọn)
  nav.on('mouseenter', 'a.has-submenu', function () {
    const submenu = $(this).next('.submenu');
    if (!submenu.hasClass('show')) {
      nav.find('.submenu').not(submenu).removeClass('show').slideUp(200);
      submenu.addClass('show').stop(true, true).slideDown(200);
    }
  });

  // Active menu khi scroll
  const sections = getSections();
  $(window).on('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const currentId = findCurrentSection(sections);
      if (currentId) {
        updateActiveLink(currentId);
      }
    }, 100);
  }).trigger('scroll');

  // Nếu có hash khi load trang
  const hash = window.location.hash;
  if (hash && $(hash).length) {
    setTimeout(() => {
      scrollToTarget(hash);
      updateActiveLink(hash.substring(1));
    }, 300);
  } else {
    // Nếu không có hash, active menu đầu tiên
    const firstId = sections.length > 0 ? sections[0].id : null;
    if (firstId) {
      updateActiveLink(firstId);
    }
  }
});
