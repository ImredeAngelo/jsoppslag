function setStyleById(id, style, state = true) {
    if(!document.getElementById(id)) return;
    if(state) document.getElementById(id).classList.add(style);
    else document.getElementById(id).classList.remove(style);
}

function createListItem(title) {
    var parent = document.getElementById("browse");
    var element = document.createElement("button");
    var text = document.createTextNode(title.replace(/-/g, " "));
    element.setAttribute("onclick", "layout.navigate('view', false, 'page="+title+"')");
    element.appendChild(text);
    parent.appendChild(element);

    return element;
}
