/*!
 * Documenter 2.0
 * http://rxa.li/documenter
 *
 * Copyright 2011, Xaver Birsak
 * http://revaxarts.com
 *
 */

// $(document).ready(function () {
//     function menu_scroll() {
//         $("#documenter_nav li a").on("click", function () {
//             var anchor = $(this).attr("href").split("#")[1];
//             var largeScreen = matchMedia("only screen and (min-width: 992px)").matches;
//             var headerHeight = 0;
//             headerHeight = $(".header").height();
//             if (anchor) {
//                 if ($("#" + anchor).length > 0) {
//                     if ($(".upscrolled").length > 0 && largeScreen) {
//                         headerHeight = headerHeight;
//                     } else {
//                         headerHeight = 0;
//                     }
//                     var target = $("#" + anchor).offset().top - headerHeight;
//                     $("html,body").animate({ scrollTop: target }, 1000, "easeInOutExpo");
//                 }
//             }
//             return false;
//         });

//         $("#documenter_nav li a").on("click", function () {
//             $(this).addClass("active").parent().siblings().children().removeClass("active");
//         });
//     }

//     menu_scroll();

//     var onepage_nav = function () {
//         $(".onepage .mainnav > ul > li > a").on("click", function () {
//             var anchor = $(this).attr("href").split("#")[1];
//             var largeScreen = matchMedia("only screen and (min-width: 992px)").matches;
//             var headerHeight = 0;
//             headerHeight = $(".header").height();
//             if (anchor) {
//                 if ($("#" + anchor).length > 0) {
//                     if ($(".upscrolled").length > 0 && largeScreen) {
//                         headerHeight = headerHeight;
//                     } else {
//                         headerHeight = 0;
//                     }
//                     var target = $("#" + anchor).offset().top - headerHeight;
//                     $("html,body").animate({ scrollTop: target }, 1000, "easeInOutExpo");
//                 }
//             }
//             return false;
//         });

//         $(".onepage .mainnav ul > li > a").on("click", function () {
//             $(this).addClass("active").parent().siblings().children().removeClass("active");
//             $(this).parents("#mainnav-mobi").hide();
//         });
//     };

//     var timeout,
//         sections = new Array(),
//         sectionscount = 0,
//         win = $(window),
//         sidebar = $("#documenter_sidebar"),
//         nav = $("#documenter_nav"),
//         logo = $("#documenter_logo"),
//         navanchors = nav.find("a"),
//         timeoffset = 50,
//         hash = location.hash || null;
//     (iDeviceNotOS4 = (navigator.userAgent.match(/iphone|ipod|ipad/i) && !navigator.userAgent.match(/OS 5/i)) || false),
//         (badIE =
//             $("html")
//                 .prop("class")
//                 .match(/ie(6|7|8)/) || false);

//     //handle external links (new window)
//     $("a[href^=http]").bind("click", function () {
//         window.open($(this).attr("href"));
//         return false;
//     });

//     //IE 8 and lower doesn't like the smooth pagescroll
//     if (!badIE) {
//         window.scroll(0, 0);

//         $("a[href^=#]").bind("click touchstart", function () {
//             hash = $(this).attr("href");
//             $.scrollTo.window().queue([]).stop();
//             goTo(hash);
//             return false;
//         });

//         //if a hash is set => go to it
//         if (hash) {
//             setTimeout(function () {
//                 goTo(hash);
//             }, 50000);
//         }
//     }

//     //We need the position of each section until the full page with all images is loaded
//     win.bind("load", function () {
//         var sectionselector = "section";

//         //Documentation has subcategories
//         if (nav.find("ol").length) {
//             sectionselector = "section, h4";
//         }
//         //saving some information
//         $(sectionselector).each(function (i, e) {
//             var _this = $(this);
//             var p = {
//                 id: this.id,
//                 pos: _this.offset().top,
//             };
//             sections.push(p);
//         });

//         //iPhone, iPod and iPad don't trigger the scroll event
//         if (iDeviceNotOS4) {
//             nav.find("a").bind("click", function () {
//                 setTimeout(function () {
//                     win.trigger("scroll");
//                 }, duration);
//             });
//             //scroll to top
//             window.scroll(0, 0);
//         }

//         //how many sections
//         sectionscount = sections.length;

//         //bind the handler to the scroll event
//         win.bind("scroll", function (event) {
//             clearInterval(timeout);
//             //should occur with a delay
//             timeout = setTimeout(function () {
//                 //get the position from the very top in all browsers
//                 pos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

//                 //iDeviceNotOS4s don't know the fixed property so we fake it
//                 if (iDeviceNotOS4) {
//                     sidebar.css({ height: document.height });
//                     logo.css({ "margin-top": pos });
//                 }
//                 //activate Nav element at the current position
//                 activateNav(pos);
//             }, timeoffset);
//         }).trigger("scroll");
//     });

//     //the function is called when the hash changes
//     function hashchange() {
//         goTo(location.hash, false);
//     }

//     //scroll to a section and set the hash
//     function goTo(hash, changehash) {
//         win.unbind("hashchange", hashchange);
//         hash = hash.replace(/!\//, "");
//         win.stop().scrollTo(hash, duration, {
//             easing: easing,
//             axis: "y",
//         });
//         if (changehash !== false) {
//             var l = location;
//             location.href = l.protocol + "//" + l.host + l.pathname + "#!/" + hash.substr(1);
//         }
//         win.bind("hashchange", hashchange);
//     }

//     //activate current nav element
//     function activateNav(pos) {
//         var offset = 100,
//             current,
//             next,
//             parent,
//             isSub,
//             hasSub;
//         win.unbind("hashchange", hashchange);
//         for (var i = sectionscount; i > 0; i--) {
//             if (sections[i - 1].pos <= pos + offset) {
//                 navanchors.removeClass("current");
//                 current = navanchors.eq(i - 1);
//                 current.addClass("current");

//                 parent = current.parent().parent();
//                 next = current.next();

//                 hasSub = next.is("ul");
//                 isSub = !parent.is("#documenter_nav");

//                 nav.find("ol:visible").not(parent).slideUp("fast");
//                 if (isSub) {
//                     parent.prev().addClass("current");
//                     parent.stop().slideDown("fast");
//                 } else if (hasSub) {
//                     next.stop().slideDown("fast");
//                 }
//                 win.bind("hashchange", hashchange);
//                 break;
//             }
//         }
//     }

//     // make code pretty
//     window.prettyPrint && prettyPrint();
// });

$(document).ready(function () {
    const navLinks = $("#documenter_nav a:not(.collapsed)");
    navLinks.removeClass("current");
    navLinks.first().addClass("current");

    $(window).on("scroll", function () {
        const scrollPos = $(window).scrollTop();

        let found = false;

        navLinks.each(function () {
            const currentLink = $(this);
            const sectionId = currentLink.attr("href");
            const section = $(sectionId);

            if (section.length) {
                const sectionTop = section.offset().top - 150;
                const sectionBottom = sectionTop + section.outerHeight();

                if (scrollPos >= sectionTop && scrollPos < sectionBottom && !found) {
                    navLinks.removeClass("current");
                    currentLink.addClass("current");
                    $(".menu-item > a").removeClass("active");

                    currentLink.closest(".menu-item").children("a").addClass("active");
                    found = true;
                }
            }
        });

        if (!found) {
            navLinks.removeClass("current");
            navLinks.first().addClass("current");
            $(".menu-item > a").removeClass("active");
            navLinks.first().closest(".menu-item").children("a").addClass("active");
        }
    });

});
