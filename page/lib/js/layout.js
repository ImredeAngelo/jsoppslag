// definerer alle sidene på nettstedet og logikken som styrer innlasting av sidene
const stateMachine = [
    layout.State("", () => {}, () => {}, "home"),
    layout.State("home", () => onEnterHome()),
    layout.State("add", () => onEnterAdd(), page => onExitAdd(page)),
    layout.State("view", page => onEnterView(page), () => onExitView()),
    layout.State("edit", page => onEnterEdit(page)),
];

document.addEventListener('DOMReady', function() {
    var navbar = document.getElementById('navbar');
    var sticky = navbar.offsetTop;

    //Klebrig navigasjonsmeny
    window.addEventListener('scroll', () => {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add('sticky')
        } else {
            navbar.classList.remove('sticky');
        }
    });

    //Oppdater liste over innlegg når et innlegg legges til eller endres
    window.addEventListener('storage', () => generateEntryList());

    generateEntryList();
})

document.addEventListener('onPageChangeError', function() {
    document.querySelector('.error').classList.add('visible');
})
