(() =>
    new Swiper('.section1__mainSlice', {
        spaceBetween: 30,
        pagination: {
            el: '.section1__pagination',
        },
    })
)();
(() =>
    new Swiper('.section6__mainSlice', {
        centeredSlides: true,
        grabCursor: true,
        loop: true,
        autoplay: {
            delay: 2000,
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 6,
            },
            720: {
                slidesPerView: 4,
                spaceBetween: 10,
            },
            992: {
                slidesPerView: 6,
                spaceBetween: 15,
            }
        }
    })
)();

$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    if (scroll !== 0) {
        $('.header').attr('style', '--color: #fff; border-bottom: 1px solid #e5e5e5')
    } else {
        $('.header').attr('style', '--color: none')
    }
});

$(document).ready(function () {
    $('.header__bar').on('click', () => {
        $('.header__left').toggleClass('show__menu')
    })
})