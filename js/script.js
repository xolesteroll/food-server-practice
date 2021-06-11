window.addEventListener('DOMContentLoaded', function () {

    // Tabs

    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    let deadLine = '2021-06-12';


    const getTimeOffset = (endtime) => {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    };

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    const setTimer = (selector, endtime) => {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateTimer, 1000);

        updateTimer();

        function updateTimer() {
            const t = getTimeOffset(endtime);

            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);
            if (t.total <= 0) {
                clearInterval(timeInterval);
                days.textContent = 0;
                hours.textContent = 0;
                minutes.textContent = 0;
                seconds.textContent = 0;
            }
        }
    };

    setTimer('.timer', deadLine);

    // Modal

    const modalTriggers = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    const openModal = () => {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
        window.removeEventListener('scroll', modalShowOnScroll);
    };

    const closeModal = () => {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modal);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 100000);

    const modalShowOnScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', modalShowOnScroll);
        }
    };

    window.addEventListener('scroll', modalShowOnScroll);

    // Используем классы для карточек

    class MenuCard {
        constructor(imageSrc, alt, title, descr, price, parentSelector, ...classes) {
            this.imageSrc = imageSrc;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price *= this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                <img src=${this.imageSrc} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.prepend(element);
        }
    }

    // const getResource = async (url) => {
    //     const res = await fetch(url);

    //     if (!res.ok) {
    //         throw new Error(`Could now fetch ${url}, status: ${res.status}`);
    //     }

    //     return await res.json();
    // };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => data.data.forEach(({ img, altimg, title, descr, price }) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        }));

    // Forms 

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что то пошло не так'
    };

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    const bindPostData = (form) => {
        form.addEventListener('submit', (e) => {
            window.removeEventListener('scroll', modalShowOnScroll);

            e.preventDefault();

            const messageBlock = document.createElement('img');
            messageBlock.src = message.loading;
            messageBlock.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', messageBlock);



            // request.setRequestHeader('Content-type', 'application/json'); // Когда мы работаем со связкой XMLHttpRequest + FormData нам не нужно указывать заголовок
            const formData = new FormData(form);

            // const object = {};    // Устаревший способо самоделкиных для преобразования объекта в json
            // formData.forEach((value, key) => {
            //     object[key] = value;
            // });

            const json = JSON.stringify(Object.fromEntries(formData.entries()));


            postData('http://localhost:3000/requests', json)
                .then(data => {
                    showThanksModal(message.success);
                    // fetch('http://localhost:3000/requests')
                    //     .then(data => data.json())
                    //     .then(res => console.log(res));
                    messageBlock.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });

            // request.send(json);
        });
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close="">×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Fetch API

    // slider 1 ПРОСТО НАХУЙ ИДЕАЛЬНО СДЕЛАЛ САМ ЕБАТЬ КОЛОТИТЬ КРАСАВА!! ! ! !  ! 

    const slides = document.querySelectorAll('.offer__slide');
    const slider = document.querySelector('.offer__slider');
    const leftArrow = document.querySelector('.offer__slider-prev');
    const rightArrow = document.querySelector('.offer__slider-next');
    const slidesWrapper = document.querySelector('.offer__slider-wrapper');
    const slidesInner = document.querySelector('.offer__slider-inner');
    const width = window.getComputedStyle(slidesWrapper).width;
    let currentSlideInfo = document.querySelector('#current');
    let totalSlidesInfo = document.querySelector('#total');
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

    // Calculator

    const totalResult = document.querySelector('.calculating__result span');

    
    let sex, 
    height, weight, age, 
    ratio = "1.375" ;
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 'female';
        localStorage.setItem('ratio', 1.375);
    }

    const initLocalSettings = (selector, activeClass) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            } 

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            } 
        });
    }

    initLocalSettings('.calculating__choose-item', 'calculating__choose-item_active')

    const calcTotal = () => {
        if (!sex || !height || !weight || !age || !ratio) {
            totalResult.textContent = '____';
            return;
        }

        if (sex == 'female') {
            totalResult.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            totalResult.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    };

    calcTotal();

    const getStaticInfo = (parentSelector, activeClass) => {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        document.querySelector(parentSelector).addEventListener('click', (e) => {
            if (e.target.getAttribute('data-ratio')) {
                ratio = +e.target.getAttribute('data-ratio');
                localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'))
            } else {
                sex = e.target.getAttribute('id');
                localStorage.setItem('sex', e.target.getAttribute('id'))
            }

            elements.forEach(elem => {
                elem.classList.remove(activeClass);
            });

            if (e.target != document.querySelector(parentSelector)) {
                e.target.classList.add(activeClass);
            }

            calcTotal();

        });
    };


    const getDynamicInfo = (selector) => {
        const input = document.querySelector(selector);


        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getStaticInfo('#gender', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');
    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
});

