function getEntries() {
    //lag liste fra lokal lagring
    var list = localStorage.getItem("list").split(",");

    //lag elementer
    for(let i = 0; i < list.length; i++)
        createListItem(list[i]);
}

function createListItem(title) {
    var parent = document.getElementById("browse");
    var element = document.createElement("button");
    var text = document.createTextNode(title.replace("-", " "));
    element.setAttribute("onclick", "view('"+title+"')");
    element.appendChild(text);
    parent.appendChild(element);

    return element;
}

// -- VIEW

document.addEventListener("viewChanged", e => {
    var page = e.detail.page;
    var serializedData = localStorage.getItem(page);

    if(!serializedData)
        serializedData = "Fant ikke siden!";

    document.getElementById("view-title").innerHTML = page.replace("-", " ");
    document.getElementById("view-content").innerHTML = serializedData;
});

// -- ADD

function validate(form) {
    var list = localStorage.getItem("list");
    var title = form[0].value;
    var content = form[1].value;
    var serialized = title.replace(" ", "-");

    if(!list.includes(serialized)) {
        localStorage.setItem(serialized, content);
        var btn = createListItem(serialized);

        localStorage.setItem("list", list + (list ? "," : "") + title.replace(" ", "-"));
        btn.click();
    }

    //TODO: Si til bruker at innlegg allerede finnes
    return true;
}
