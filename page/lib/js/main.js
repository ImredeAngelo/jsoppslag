class Entry {
    constructor(name, description, example, resources) {
        this.name = name,
        this.description = description;
        this.example = example;
        this.resources = resources;
    }
}

// ----- TRANSITIONS

function onEnterHome() {
    document.title = "JSOppslag | Hjem";
}

function onEnterAdd() {
    document.title = "JSOppslag | Legg til nytt innlegg";
    document.getElementById('save-button').addEventListener('click', () => {
        var name = document.getElementById('name-entry').value;
        if (name) {
            var description = document.getElementById('description-entry').value;
            var example = document.getElementById('example-entry').value;
            var resources = document.getElementById('resources-entry').value.split('\n');
            var entry = new Entry(name, description, example, resources);

            localStorage.setItem(name, JSON.stringify(entry));

            window.dispatchEvent(new Event('storage'));
            window.location.hash = 'view?page=' + layout.encode(name) + '&created=success';
        } else {
            layout.showError();
        }
    });
}

function onExitAdd(query) {
    var newPage = query.get("created");
    if (newPage == "success") {
        document.getElementById('name-entry').value = "";
        document.getElementById('description-entry').value = "";
        document.getElementById('example-entry').value = "";
        document.getElementById('resources-entry').value = "";
    }
}

function onEnterView(query) {
    var page = query.get("page");
    var resources = document.getElementById('resources');
    var entry = JSON.parse(localStorage.getItem(page));

    if(!entry) {
        layout.showError();
        return;
    }

    document.title = "JSOppslag | " + page;
    document.getElementById('name').textContent = entry.name;

    if(entry.description != "") {
        var description = document.getElementById('description');
        description.innerHTML = entry.description.split('\n').join('<br>');
        description.classList.remove('hidden');
        document.getElementById('header-description').classList.remove('hidden');
    }

    if(entry.example != "") {
        var example = document.getElementById('example');
        example.innerHTML = entry.example.split('\n').join('<br>');
        example.classList.remove('hidden');
        document.getElementById('header-example').classList.remove('hidden');
    }

    if(entry.example != "") {
        var resources = document.getElementById('resources');
        resources.classList.remove('hidden');
        document.getElementById('header-resources').classList.remove('hidden');

        while(resources.firstChild) {
            resources.removeChild(resources.firstChild);
        }

        for(var i = 0; i < entry.resources.length; i++) {
            var resource = entry.resources[i]
            var item = document.createElement('a')

            item.innerText = resource;
            item.href = resource;

            resources.appendChild(item)
            resources.appendChild(document.createElement('br'))
        }
    }

    document.getElementById('edit-button').onclick = function() {
        window.location.hash = 'edit?page=' + layout.encode(page);
    };

    document.getElementById('delete-button').onclick = function() {
        localStorage.removeItem(page);

        window.dispatchEvent(new Event('storage'));
        window.location.hash = 'home';
    };
}

function onExitView() {
    document.getElementById('header-description').classList.add('hidden');
    document.getElementById('description').classList.add('hidden');
    document.getElementById('header-example').classList.add('hidden');
    document.getElementById('example').classList.add('hidden');
    document.getElementById('header-resources').classList.add('hidden');
    document.getElementById('resources').classList.add('hidden');
}

function onEnterEdit(query) {
    var page = query.get("page");
    var entry = JSON.parse(localStorage.getItem(page));

    if(!entry) {
        layout.showError();
        return;
    }

    document.querySelector('.edit').classList.add('visible');
    document.getElementById('edit-description-entry').value = entry.description;
    document.getElementById('edit-example-entry').value = entry.example;
    document.getElementById('edit-resources-entry').value = entry.resources.join('\n');

    document.getElementById('edit-save-button').onclick = function() {
        entry.description = document.getElementById('edit-description-entry').value;
        entry.example = document.getElementById('edit-example-entry').value;
        entry.resources = document.getElementById('edit-resources-entry').value.split('\n');

        localStorage.setItem(page, JSON.stringify(entry));

        window.dispatchEvent(new Event('storage'));
        window.location.hash = 'view?page=' + layout.encode(page);
    };
}

// ----- HELPERS

function generateEntryList() {
    var entries = [];

    //Hent innlegg fra lokal lagring
    for (var i = 0; i < localStorage.length; i++) {
        entries.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    //Sorter innlegg alfabetisk etter navn
    entries.sort((a, b) => {
        return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
    });

    var parent = document.getElementById('browse');
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    for(var i = 0; i < entries.length; i++) {
        var entry = entries[i]
        var item = document.createElement('a')

        parent.appendChild(document.createElement('p'));

        item.innerText = entry.name;
        item.classList.add('sidebar-entry');
        item.href = '#view?page=' + encodeURI(layout.encode(entry.name));

        parent.lastChild.appendChild(item)
    }
}
