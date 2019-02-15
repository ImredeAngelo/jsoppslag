/** SINGLE PAGE APPLICATION LAYOUT FRAMEWORK
 * Laster inn hele siden i samme dokument
 * Siden trenger bare lastes inn én gang, så kan den brukes offline
 * Siden kan deles opp i gjenbrukbare moduler (se lib/html)
 * Må kjøre init() fra index dokumentet når det er klart, og gi en state machine fra hovedscriptet for å fungere
 */

var state = "uninitialized";
var modules = {};

function init() {
    //Oppdater logg
    window.addEventListener('popstate', function(event) {
        if (event.state) {
            document.getElementById("content").innerHTML = event.state.content;
            document.title = event.state.title;
        }
    });

    //Last inn rett startside
    var state = location.pathname.substr(1, location.pathname.length - 1);
    if (state == "")
        state = "home";

    //Send event 'Layout Loaded' - Her må state machine registreres
    document.dispatchEvent(new CustomEvent("layoutLoaded", {
        detail: {
            //Registrer state machine fra hovedscript
            registerTransitions: async function(stateMachine) {
                //Last inn moduler
                for(let state in stateMachine) {
                    if (stateMachine.hasOwnProperty(state)) {
                        modules[state] = await loadModule(state);
                    }
                }

                //Definer transitions
                document.addEventListener("stateChanged", e => {
                    var state = e.detail.state;
                    var func = stateMachine[state];
                    if (func) {
                        func(e.detail);
                    } else {
                        location.assign(location.origin);
                    }
                })

                //Naviger etter alle modulene har blitt lastet inn (async-await)
                navigate(state, location.search.replace("?", ""));
            }
        }
    }));

    var navbar = document.getElementById("navbar");
    var sticky = navbar.offsetTop;

    //Klebrig navigasjonsmeny
    window.onscroll = () => {
      if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
      } else {
        navbar.classList.remove("sticky");
      }
    }
}

function loadModule(module) {
    const url = location.origin + "/lib/html/" + module + ".html";
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function(e) {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function navigate(state, keepQuery = false, query = null) {
    var url = location.origin + "/" + state;
    var urlParams;

    if(keepQuery) {
        url += location.search;
        urlParams = new URLSearchParams(location.search);
    } else {
        url += (query ? "?" + query : "");
        urlParams = new URLSearchParams(query);
    }

    setState(state, urlParams, url);
}

function setState(state, params, url) {
    const html = modules[state];
    if(html) {
        //Last inn modul
        document.getElementById("content").innerHTML = html;

        //Send 'State Changed' event
        document.dispatchEvent(new CustomEvent("stateChanged", {
            detail: {
                "previous": this.state,
                "state": state,
                "params": params
            }
        }));

        //Oppdater logg
        var first = this.state == "uninitialized";
        setHistory(document.title, document.getElementById("content").innerHTML, url, first);
        this.state = state;
    }
}

function setHistory(title, content, url, replace) {
    const data = {
        "content":content,
        "title":title
    }

    if(replace) window.history.replaceState(data, document.title, url);
    else window.history.pushState(data, document.title, url);
}

function setStyleById(id, style, state = true) {
    if(!document.getElementById(id)) return;
    if(state) document.getElementById(id).classList.add(style);
    else document.getElementById(id).classList.remove(style);
}
