/** CUSTOM SPA FRAMEWORK
 * Får siden til å fungere på én side som en Single Page Application
 * Siden trenger bare lastes inn én gang
 * Siden har ett template som fungerer for alle 'sidene' og ett sted der innhold vises/endres
 */

var state = "home";
var page = "";

// Entry Point -> Laster inn rett side og klargjør manipulasjon av nettlesers history objekt
// TODO: Lag side med history state ved manuell navigasjon
function init() {
    const urlParams = new URLSearchParams(window.location.search);
    var state = location.pathname.substr(1, location.pathname.length - 1);

    switch(location.pathname) {
        //Vis side
        case "/view":
            var page = urlParams.get("page");
            if (page) view(page);
            else location.href = location.origin;
            break;

        //Endre side
        case "/edit":
            var page = urlParams.get("page");
            if (page) edit(page);
            else location.href = location.origin;
            break;

        //Legg til side
        case "/add":
            navigate("add");
            break;

        //Hjem
        default:
            console.log(location.pathname);
            break;
    }

    window.addEventListener('popstate', function(event) {
        if (event.state) {
            document.getElementById("content").innerHTML = event.state.html;
            document.title = event.state.title;
        }
    });

    document.dispatchEvent(new CustomEvent("layoutLoaded"));

    setState(state);
}

function view(page) {
    //Bare gjør noe ved bytte
    if(page == this.page && this.state == "view")
        return;

    if(this.state == "edit") {
        console.log("Edit page: " + page);
        return;
    }

    //Husk hvor vi er
    this.page = page;

    //Send ut event
    document.dispatchEvent(new CustomEvent("viewChanged", {
        detail: {
            "page": page
        }
    }));

    //Klargjør side
    setState("view", "view?page=" + page, page.replace("-", " "));
}

function edit(page) {
    if(this.state == "edit")
        return;

    setState("edit", "edit?page=" + page);
}

function navigate(state) {
    if(state == "edit") {
        const urlParams = new URLSearchParams(window.location.search);
        var page = urlParams.get("page");
        if (page) {
            edit(page);
            return;
        }
    }

    setState(state, state, state);
}

function setState(state, url, title = "") {
    //Gjem gammel side og vis ny
    setStyleById(this.state, "hidden", true);
    setStyleById(state, "hidden", false);

    //Send event
    document.dispatchEvent(new CustomEvent("viewChanged", {
        detail: {
            "page": page
        }
    }));

    //Sett URL & History
    var pageTitle = "Preview | " + title;
    var data = {
        "html":document.getElementById("content").innerHTML,
        "title":pageTitle
    }

    document.title = pageTitle;
    window.history.pushState(data, pageTitle, url);

    //Send ut event -- stateChanged ??

    this.state = state;
}

// -- HELPERS
function setStyleById(id, style, state = true) {
    if(!document.getElementById(id)) return;
    if(state) document.getElementById(id).classList.add(style);
    else document.getElementById(id).classList.remove(style);
}
