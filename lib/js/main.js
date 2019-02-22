class Entry {
  constructor(name, description, example, resources) {
    this.name = name,
    this.description = description;
    this.example = example;
    this.resources = resources;
  }
}

var testEntry = new Entry(
  'Test entry',
  'An entry made for testing purposes',
  'example goes here',
  ['#test entry']
);

var testEntry2 = new Entry(
  'Test entry 2',
  'Another entry made for testing purposes',
  'example goes here',
  ['#test entry']
);

localStorage.setItem('test entry', JSON.stringify(testEntry));
localStorage.setItem('test entry 2', JSON.stringify(testEntry2));

//Funksjoner som avhenger av at deler av siden er blitt lastet inn kjøres etter at innlasting av DOM-elementer er fullført
window.addEventListener('load', () => {
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

  //Endre side når hash endres
  window.addEventListener('hashchange', () => {
    render(decodeURI(window.location.hash))
  });

  //Oppdater liste over innlegg når et innlegg legges til eller endres
  window.addEventListener('storage', () => {
    generateEntryList();
  });

  window.dispatchEvent(new Event('hashchange'));
  window.dispatchEvent(new Event('storage'));

  function render(url) {
    var temp = url.split('/')[0];

    document.querySelectorAll('.page').forEach((page) => {
      page.classList.remove('visible');
    });

    document.querySelectorAll('.header-element').forEach((element) => {
      element.classList.remove('active');
    });

    var map = {
      '': () => {
        renderHome();
      },
      '#add': () => {
        renderAdd();
      },
      '#edit': () => {
        var key = url.split('entry/')[1].trim();

        renderEdit(key);
      },
      '#view': () => {
        var key = url.split('entry/')[1].trim();

        renderView(key);
      }
    }

    if (map[temp]) {
      map[temp]();
    } else {
      renderError();
    }
  }

  function renderHome() {
    document.querySelector('.home').classList.add('visible');
    document.getElementById('home-button').classList.add('active');
  }

  function renderAdd() {
    document.querySelector('.add').classList.add('visible');
    document.getElementById('add-button').classList.add('active');
  }

  function renderEdit(key) {
    document.querySelector('.edit').classList.add('visible');
  }

  function renderView(key) {
    document.querySelector('.view').classList.add('visible');
  }

  function renderError() {
    document.querySelector('.error').classList.add('visible');
  }

  function generateEntryList() {
    var entries = [];

    //Hent innlegg fra lokal lagring
    for (var i = 0; i < localStorage.length; i++){
      entries.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    //Sorter innlegg alfabetisk etter navn
    entries.sort((a, b) => {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    });

    var parent = document.getElementById('browse');

    while(parent.firstChild){
      parent.removeChild(parent.firstChild);
    }

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i]
      var item = document.createElement('a')

      parent.appendChild(document.createElement('p'));

      item.innerText = entry.name;
      item.classList.add('sidebar-entry');
      item.href = '#view/entry/' + entry.name

      parent.lastChild.appendChild(item)
    }
  }
});

//window.location.hash = 'product/' + productIndex;
