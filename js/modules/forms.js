import {closeModal, openModal, modalShowOnScroll} from './modal';
import {postData} from '../services/services';

function forms(formSelector, modalTimerId) {
    // Forms 

    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что то пошло не так'
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
        openModal('.modal', modalTimerId);

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
            closeModal('.modal');
        }, 4000);
    }
}



export default forms;