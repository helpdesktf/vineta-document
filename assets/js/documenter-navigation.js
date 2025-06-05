$(function () {
    const $nav = $("#documenter_nav");
    const $menuItems = $nav.find('a[href^="#"]');
    const headerHeight = $(".header").outerHeight() || 0;

    // Lấy vị trí top của section mục tiêu
    function getTargetTop(hash) {
        const $target = $(hash);
        if ($target.length) {
            return $target.offset().top - headerHeight;
        }
        return null;
    }

    // Đóng tất cả submenu, trừ submenu truyền vào (nếu có)
    function closeAllSubmenus(except) {
        $nav.find(".submenu").each(function () {
            const $submenu = $(this);
            if (except && $submenu.is(except)) return;
            if ($submenu.is(":visible") && !$submenu.is(":animated")) {
                $submenu.stop(true, false).slideUp(300).attr("aria-hidden", "true");
                $submenu.prev("a.has-submenu").removeClass("open-submenu active").attr("aria-expanded", "false");
            }
        });
    }

    // Cập nhật trạng thái active menu/submenu theo hash
    function activateMenuByHash(hash) {
        if (!hash) return;
        const $targetLink = $menuItems.filter(`[href="${hash}"]`);
        if ($targetLink.length === 0) return;

        if ($targetLink.hasClass("active")) return; // tránh lặp

        $menuItems.removeClass("active");
        $targetLink.addClass("active");

        const $submenu = $targetLink.closest(".submenu");
        if ($submenu.length) {
            const $parentMenu = $submenu.prev("a.has-submenu");
            if (!$parentMenu.hasClass("open-submenu")) {
                closeAllSubmenus($submenu);
                $parentMenu.addClass("active open-submenu").attr("aria-expanded", "true");
                if (!$submenu.is(":animated")) {
                    $submenu.stop(true, false).slideDown(300).attr("aria-hidden", "false");
                }
            }
        } else {
            closeAllSubmenus();
        }
        updateBackgroundStyles();
    }

    // Cập nhật class background cho menu (menu không có submenu hoặc chưa active submenu có background)
    function updateBackgroundStyles() {
        $nav.find("a").each(function () {
            const $a = $(this);
            const hasSub = $a.hasClass("has-submenu");
            if (!hasSub) {
                $a.addClass("no-bg"); // menu ko submenu luôn có bg
            } else {
                if ($a.hasClass("open-submenu")) {
                    $a.removeClass("no-bg"); // submenu đang mở thì bỏ bg
                } else {
                    $a.addClass("no-bg"); // submenu chưa mở thì bg
                }
            }
        });
    }

    // Click menu items
    $menuItems.on("click", function (e) {
        const $this = $(this);
        const hash = $this.attr("href");
        const targetTop = getTargetTop(hash);

        if ($this.hasClass("has-submenu")) {
            e.preventDefault();
            const isOpen = $this.hasClass("open-submenu");
            const $submenu = $this.next(".submenu");

            if (isOpen) {
                if (!$submenu.is(":animated")) {
                    $submenu.stop(true, false).slideUp(300).attr("aria-hidden", "true");
                    $this.removeClass("open-submenu active").attr("aria-expanded", "false");
                }
            } else {
                // Chỉ mở 1 submenu tại 1 thời điểm
                closeAllSubmenus($submenu);
                $this.addClass("active open-submenu").attr("aria-expanded", "true");
                if (!$submenu.is(":animated")) {
                    $submenu.stop(true, false).slideDown(300).attr("aria-hidden", "false");
                }
            }
            updateBackgroundStyles();
        } else {
            if (targetTop !== null) {
                e.preventDefault();
                // Scroll đến vị trí
                $("html, body").stop(true, false).animate({ scrollTop: targetTop }, 400);
                activateMenuByHash(hash);
            }
        }
    });

    // Hover mở submenu với delay để tránh đóng mở đột ngột
    let hoverTimeout;
    $nav.on("mouseenter", "a.has-submenu", function () {
        clearTimeout(hoverTimeout);
        const $this = $(this);
        const $submenu = $this.next(".submenu");
        if (!$this.hasClass("open-submenu")) {
            closeAllSubmenus($submenu);
            $this.addClass("open-submenu active").attr("aria-expanded", "true");
            if (!$submenu.is(":animated")) {
                $submenu.stop(true, false).slideDown(300).attr("aria-hidden", "false");
            }
            updateBackgroundStyles();
        }
    }).on("mouseleave", "a.has-submenu", function () {
        const $this = $(this);
        const $submenu = $this.next(".submenu");
        hoverTimeout = setTimeout(() => {
            if ($submenu.is(":visible") && !$submenu.is(":animated")) {
                $submenu.stop(true, false).slideUp(300).attr("aria-hidden", "true");
                $this.removeClass("open-submenu active").attr("aria-expanded", "false");
                updateBackgroundStyles();
            }
        }, 350);
    });

    // Hover trên submenu giữ submenu mở
    $nav.on("mouseenter", ".submenu", function () {
        clearTimeout(hoverTimeout);
    }).on("mouseleave", ".submenu", function () {
        const $submenu = $(this);
        const $parentMenu = $submenu.prev("a.has-submenu");
        hoverTimeout = setTimeout(() => {
            if ($submenu.is(":visible") && !$submenu.is(":animated")) {
                $submenu.stop(true, false).slideUp(300).attr("aria-hidden", "true");
                $parentMenu.removeClass("open-submenu active").attr("aria-expanded", "false");
                updateBackgroundStyles();
            }
        }, 350);
    });

    // Lấy danh sách sections với vị trí offset top
    function getSections() {
        const sections = [];
        $("section[id], article[id], h4[id]").each(function () {
            sections.push({ id: this.id, offset: $(this).offset().top });
        });
        return sections.sort((a, b) => a.offset - b.offset);
    }

    // Tìm section hiện tại theo vị trí scroll
    function findCurrentSection(sections) {
        const scrollPos = $(window).scrollTop() + headerHeight + 10;
        for (let i = sections.length - 1; i >= 0; i--) {
            if (scrollPos >= sections[i].offset) {
                return sections[i].id;
            }
        }
        return null;
    }

    let scrollTimeout;
    const sections = getSections();

    // Tự động active menu/submenu khi scroll
    $(window).on("scroll", function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const currentId = findCurrentSection(sections);
            if (currentId) {
                activateMenuByHash("#" + currentId);
            }
        }, 120);
    });

    // Khởi tạo ban đầu
    function init() {
        const hash = window.location.hash;
        if (hash && $(hash).length) {
            setTimeout(() => {
                const targetTop = getTargetTop(hash);
                if (targetTop !== null) {
                    $("html, body").scrollTop(targetTop);
                    activateMenuByHash(hash);
                }
            }, 300);
        } else {
            if (sections.length > 0) {
                activateMenuByHash("#" + sections[0].id);
            }
        }
        updateBackgroundStyles();
    }

    init();
});
