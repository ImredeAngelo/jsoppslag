/** SINGLE PAGE APPLICATION LAYOUT FRAMEWORK
 * Laster inn hele siden i samme dokument
 * Siden trenger bare lastes inn én gang, så kan den brukes offline
 * Siden kan deles opp i gjenbrukbare moduler (se lib/html)
 * Generelt framework, helt uavhengig
 * States og overganger mellom de defineres i et annet script, se main.js
 */

// TODO:
// - Se over og refaktorer setState(), setHistory() og navigate()

(function(global) {
    "use strict";

    var state = "uninitialized";
    var transitions = {};
    var modules = {};

    init();

    // Må vente på at DOM er klar for å bruke content elementet
    document.onreadystatechange = function() {
        if (document.readyState === 'interactive') {
            document.dispatchEvent(new Event("onDOMReady"));
        }
    }

    // ----- PRIVATE FUNCTIONS

    // Init layout
    function init() {
        //Oppdater siden hvis transition er definert
        document.addEventListener("onStateChanged", (event) => {
            transition(event.detail.lastState, false, event.detail);
            transition(event.detail.newState, true, event.detail);
        });

        //Oppdater logg når bruker går tilbake
        window.addEventListener("popstate", (event) => {
            if (event.state) {
                document.getElementById("content").innerHTML = event.state.content;
                document.title = event.state.title;
            }
        });

        //Last inn rett startside
        let startState = location.pathname.substr(1, location.pathname.length - 1);
        if (startState == "")
            startState = "home";

        //Naviger til rett side når DOM er klar
        document.addEventListener("onDOMReady", () => {
            layout.navigate(startState, true);
        });
    }

    // Last inn side fra lib/html/module.html (async)
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

    // Håndter OnEnter/OnExit overganger
    function transition(state, entering, params) {
        var obj = transitions[state];
        if (obj) {
            var func = entering ? obj.enter : obj.exit;
            if (func) {
                func(params);
            }
        }
    }


    // ------------------------------ TODO: Se over og refaktorer

    async function setState(newState, params, url) {
        // Vent på at modulen er lastet inn
        while(modules[newState] == "PROCESSING") {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        //Last inn modul
        const html = modules[newState];
        if(html) {
            document.getElementById("content").innerHTML = html;

            //Send 'State Changed' event
            document.dispatchEvent(new CustomEvent("onStateChanged", {
                detail: {
                    "lastState": state,
                    "newState": newState,
                    "params": params
                }
            }));

            //Oppdater logg
            var first = state == "uninitialized";
            setHistory(document.title, document.getElementById("content").innerHTML, url, first);
            state = newState;
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

    // ------------------------------


    // ----- PUBLIC FUNCTIONS

    global.layout = {
        addState: async function(state, onEnter, onExit) {
            transitions[state] = {
                enter: onEnter,
                exit: onExit,
            };

            modules[state] = "PROCESSING";
            modules[state] = await loadModule(state);
        },
        setState: function(nextState) {
            state = nextState;
        },
        navigate: function(state, keepQuery = false, query = null) {
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
    };

    global.State = function(state, onEnter, onExit) {
        global.layout.addState(state, onEnter, onExit);
    }

}(this));
