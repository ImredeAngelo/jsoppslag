// ----- LAYOUT
// framework.js er uavhengig, men state transitions må defineres manuelt her

//State Machine definerer alle sidene på nettstedet og logikken som styrer innlasting av sidene
const stateMachine = [
    State("home", () => { document.title = "JSOppslag | Hjem"; }),
    State("add", () => { document.title = "JSOppslag | Legg til nytt innlegg"; }),
    State("search", () => { document.title = "JSOppslag | Søk"; }),
    State("view", detail => view(detail)),
    State("edit", detail => edit(detail)),
];

document.addEventListener("onDOMReady", () => getEntries());


// ----- HOVEDSIDE
// All kode går her eller i eget script i index.html

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
        console.log("Si at bruker må velge side før de trykker på edit?");
    }
}

// -- SEARCH
