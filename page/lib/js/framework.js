/** SINGLE PAGE APPLICATION LAYOUT FRAMEWORK
 * States og overganger mellom de defineres i et annet script, se layout.js
 * v2 fjernet HTTP innlasting, og kan derfor ikke bruke separate moduler som v1
 * Ellers burde alt være likt v1, så den burde fungere offline på alle nettlesere med EMCA 5 og nyere
 */

(function(global) {
    "use strict";

    var currentState = "uninitialized";
    var transitions = {};

    init();

    // Signaliser at DOM er lastet ferdig for alle nettlesere
    document.onreadystatechange = function() {
        if (document.readyState === 'interactive') {
            document.dispatchEvent(new Event("DOMReady"));
        }
    }

    // ----- PRIVATE FUNCTIONS

    function init() {
        //Naviger til rett side når DOM er klar
        document.addEventListener('DOMReady', () => renderPageFromHash());

        //Endre side når hash endres
        window.addEventListener('hashchange', () => renderPageFromHash());
    }

    function renderPageFromHash() {
        var url = layout.decode(window.location.hash);
        var state = url.substr(1, url.length - 1).split('?')[0];
        var param = new URLSearchParams(url.replace("#" + state, ""));

        document.dispatchEvent(new CustomEvent("onPageChange", {
            detail: {
                "lastState": currentState,
                "nextState": state
            }
        }));

        var page = document.getElementById(state);

        document.querySelectorAll('.page').forEach(element => {
            if (element.id == state) {
                element.classList.add('visible');
            } else {
                element.classList.remove('visible');
            }
        });

        document.querySelectorAll('.header-element').forEach(element => {
            if (element.id == state + "-button" && page) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });

        if (page) {
            transition(currentState, false, param);
            transition(state, true, param);
            currentState = state;
            return;
        }

        layout.showError();
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

    // ----- PUBLIC FUNCTIONS

    global.layout = {
        addState: function(state, onEnter, onExit) {
            transitions[state] = {
                enter: onEnter,
                exit: onExit,
            };
        },
        State: function(state, onEnter, onExit) {
            global.layout.addState(state, onEnter, onExit);
        },
        encode: function(url) {
            return url.replace(/ +/g, "~");
        },
        decode: function(url) {
            return url.replace(/~/g, " ");
        },
        showError: function() {
            document.querySelectorAll('.page').forEach(element => element.classList.remove('visible'));
            document.dispatchEvent(new Event("onPageChangeError"));
        }
    };


}(this));
