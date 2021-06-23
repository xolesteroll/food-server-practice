function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    // Fetch API

    // slider 1 ПРОСТО НАХУЙ ИДЕАЛЬНО СДЕЛАЛ САМ ЕБАТЬ КОЛОТИТЬ КРАСАВА!! ! ! !  ! 

    const slides = document.querySelectorAll(slide);
    const slider = document.querySelector(container);
    const leftArrow = document.querySelector(prevArrow);
    const rightArrow = document.querySelector(nextArrow);
    const slidesWrapper = document.querySelector(wrapper);
    const slidesInner = document.querySelector(field);
    const width = window.getComputedStyle(slidesWrapper).width;
    let currentSlideInfo = document.querySelector(currentCounter);
    let totalSlidesInfo = document.querySelector(totalCounter);
    let slideIndex = 1;
    let offset = 0;

    const addSliderNumberToCurrent = (index) => {
        if (index < 10) {
            currentSlideInfo.textContent = `0${index}`;
        } else {
            currentSlideInfo.textContent = index;
        }
    };

    const addSliderNumberToTotal = (num) => {
        if (num < 10) {
            totalSlidesInfo.textContent = `0${slides.length}`;
        } else {
            totalSlidesInfo.textContent = slides.length;
        }
    };

    const replaceNonDigits = (str => +str.replace(/\D/g, ''));

    addSliderNumberToCurrent(slideIndex);
    addSliderNumberToTotal(slides.length);

    slidesInner.style.width = 100 * slides.length + '%';
    slidesInner.style.display = 'flex';
    slidesInner.style.transition = 'all 0.5s';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const dotsWrapper = document.createElement('ol');
    const dots = [];
    dotsWrapper.classList.add('carousel-indicators');
    slider.append(dotsWrapper);


    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        dotsWrapper.append(dot);
        dots.push(dot);
    }

    rightArrow.addEventListener('click', () => {
        if (offset >= replaceNonDigits(width) * (slides.length - 1)) {
            offset = 0;
            slideIndex = 1;
        } else {
            offset += replaceNonDigits(width);
            slideIndex++;
        }

        slidesInner.style.transform = `translateX(-${offset}px)`
        addSliderNumberToCurrent(slideIndex);

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    leftArrow.addEventListener('click', () => {
        if (offset <= 0) {
            offset = replaceNonDigits(width) * (slides.length - 1);
            slideIndex = slides.length;
        } else {
            offset -= replaceNonDigits(width);
            slideIndex--;
        }

        slidesInner.style.transform = `translateX(-${offset}px)`
        addSliderNumberToCurrent(slideIndex);
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = replaceNonDigits(width) * (slideTo - 1);
            slidesInner.style.transform = `translateX(-${offset}px)`;

            if (slideIndex < 10) {
                currentSlideInfo.textContent = `0${slideIndex}`;
            } else {
                currentSlideInfo.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;
        });
    });


    // console.log('4to za huinya');


    // const showSlide = (slides, index) => {
    //     slides.forEach(slide => {
    //         slide.classList.add('hide');
    //         slide.classList.remove('show', 'fade');
    //     })

    //     if (slides[index]) {
    //         slides[index].classList.remove('hide',)
    //         slides[index].classList.add('show', 'fade')
    //     }

    // };

    // const addSliderNumberToCurrent = (index) => {
    //     if (index < 10) {
    //         currentSlideInfo.textContent = `0${index + 1}`;
    //     } else {
    //         currentSlideInfo.textContent = index + 1;
    //     }
    // };

    // const addSliderNumberToTotal = (num) => {
    //     if (num < 10) {
    //         totalSlidesInfo.textContent = `0${slides.length}`;
    //     } else {
    //         totalSlidesInfo.textContent = slides.length;
    //     }
    // };

    // const initSlider = (index = 0) => {
    //     addSliderNumberToCurrent(index);
    //     addSliderNumberToTotal(slides.length);
    //     showSlide(slides, index);

    //     leftArrow.addEventListener('click', () => {
    //         index--;
    //         if (index < 0) {
    //             index = slides.length - 1;
    //         }
    //         showSlide(slides, index);
    //         addSliderNumberToCurrent(index);
    //     });

    //     rightArrow.addEventListener('click', () => {
    //         index++;
    //         if (index >= slides.length) {
    //             index = 0;
    //         }
    //         showSlide(slides, index);
    //         addSliderNumberToCurrent(index);
    //     });


    // };


    // initSlider();

}




export default slider;