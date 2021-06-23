function tabs(tabsSelector, tabsContent, tavsParentSelector, activeClass) {
    // Tabs

    let tabs = document.querySelectorAll(tabsSelector),
        tabsContents = document.querySelectorAll(tabsContent),
        tabsParent = document.querySelector(tavsParentSelector);

    function hideTabContent() {

        tabsContents.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove(activeClass);
        });
    }

    function showTabContent(i = 0) {
        tabsContents[i].classList.add('show', 'fade');
        tabsContents[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

export default tabs;