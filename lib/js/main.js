// ----- LAYOUT
// layout.js er generell, men state transitions må defineres manuellt her

//State Machine definerer alle sidene på nettstedet og logikken som styrer innlasting av siden
//Den sendes til layout.js for å generere en Single Page Application
const stateMachine = {
    "home": () => {
        document.title = "JSOppslag | Hjem";
    },
    "add": () => {
        document.title = "JSOppslag | Legg til nytt innlegg";
    },
    "search": () => {
        document.title = "JSOppslag | Søk";
    },
    "view": detail => {
        view(detail);
    },
    "edit": detail => {
        edit(detail);
    },
}

//Lag SPA layout når klart
document.addEventListener("layoutLoaded", e => {
    e.detail.registerTransitions(stateMachine);
    getEntries();
});

// ----- HOVEDSIDE
// Funksjonene som ikke må kjøres ved innlasting av en side kan lagres i sin egen modul (/lib/html)

// -- BROWSE
function getEntries() {
    //lag liste fra lokal lagring
    var list = localStorage.getItem("list");
    if (list) {
        list = list.split(",");
        list.sort();

        //lag elementer
        for(let i = 0; i < list.length; i++)
            createListItem(list[i]);

        return;
    }

    localStorage.setItem("list", "");
}

// -- ADD
function validate(form) {
    var list = localStorage.getItem("list");
    var title = form[0].value;
    var content = form[1].value;
    var serialized = title.replace(/ +/g, "-");

    if(!list.includes(serialized)) {
        console.log(serialized, content);
        localStorage.setItem(serialized, content);
        localStorage.setItem("list", list + (list ? "," : "") + title.replace(/ +/g, "-"));

        var btn = createListItem(serialized);
        btn.click();
    }

    return false;
}

// -- VIEW
function view(detail) {
    var page = detail.params.get("page");
    if (page) {
        var serializedData = localStorage.getItem(page);

        if(!serializedData)
            serializedData = "Fant ikke siden!";

        var title = page.replace(/-/g, " ");
        document.title = "JSOppslag | " + title;

        document.getElementById("view-title").innerHTML = title;
        document.getElementById("view-content").innerHTML = serializedData;
    } else {
        location.assign(location.origin);
    }
}

// -- EDIT

function edit(detail) {
    var page = detail.params.get("page");
    if (page) {
        var serializedData = localStorage.getItem(page);

        if(!serializedData)
            serializedData = "Fant ikke siden!";

        var title = page.replace(/-/g, " ");
        document.title = "JSOppslag | Endre " + title;

        document.getElementById("view-title").innerHTML = title;
        document.getElementById("view-content").innerHTML = serializedData;
    } else {
        location.assign(location.origin);
    }
}

// -- SEARCH

// ------ HELPERS

function createListItem(title) {
    var parent = document.getElementById("browse");
    var element = document.createElement("button");
    var text = document.createTextNode(title.replace(/-/g, " "));
    element.setAttribute("onclick", "navigate('view', false, 'page="+title+"')");
    element.appendChild(text);
    parent.appendChild(element);

    return element;
}
