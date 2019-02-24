Mappestruktur:

.
+--lib
|  +--css
|  |  +--body.css
|  |  +--content.css
|  |  +--footer.css
|  |  +--header.css
|  |  +--hero.css
|  +--html
|  |  +--add.html ---+
|  |  +--edit.html --+-- eventuelt innunder index.html
|  |  +--view.html --+
|  +--js
|  |  +--layout.js
|  |  +--main.js
|  +--media
+--index.html
+--master.css



Brukergrensesnitt med støtteprogrammer:

#navigeringslinje
  >kode for å erstatte innholdet til siden
    -innholdet til siden erstattes med en av av tre dokumenter, avhengig av hvilket element i navigasjonslinjen brukerern trykker på
  #hjem
    -erstatter innholdet til siden med appens hjemmeside
  #legg til
    -erstatter innholdet til siden med en en side for å legge til funksjoner
  #rediger
    -erstatter innholdet til siden med en en side for å redigere funksjoner
  #søkefelt
    >kode for å implementere søkefunksjonalitet

#sidelinje
  >kode for å formatere informasjon om en funksjon
    -informasjon om en funksjon, lagret i localstorage som json formateres som html før den kan vises til brukeren
  >kode for å for å erstatte innholdet til siden
    -innholdet til siden erstattes med en av av vilkårlig mange automatisk formaterte dokumenter, avhengig av hvilket element i sidelinjen brukerern trykker på
  #linker til funksjoner
    -erstatter innholdet til siden med en en side som viser formatert informasjon om funksjonen

#hjemmeside
  #informasjon
  #søkefelt?
    >kode for å implementere søkefunksjonalitet

#side for å legge til funksjoner
  >kode for å lagre informasjon om funksjoner i lokal lagring (serialisering)

#side for å redigere funksjoner
  >kode for å redigere informasjon om funksjoner i lokal lagring
    -bruker funksjon for å hente fra lokal lagring og funksjon for skrive til lokal lagring for å overskrive eksisterende objekter i lokar lagring

#side som viser formatert informasjon om funksjoner
  >kode for å hente informasjon om funksjoner i lokal lagring (deserialisering)
  >kode for å formatere informasjon om funksjoner
    -informasjon om en funksjon, lagret i localstorage som json(?) formateres som html før den kan vises til brukeren



>kode for å erstatte innholdet til siden
>kode for å implementere søkefunksjonalitet
>kode for å lagre informasjon om funksjoner i lokal lagring (serialisering) ----+
>kode for å redigere informasjon om funksjoner i lokal lagring -----------------+
>kode for å hente informasjon om funksjoner i lokal lagring (deserialisering) --+
>kode for å formatere informasjon om funksjoner



localstorage{
  "funksjon": {
    "beskrivelse":       //kort beskrivelse av funksjon (string)
    "eksempel":          //formateres som kode (string)
    "ressurser": [       //bruker har mulighet til å legge til vilkårlig mange eksterne ressurser/linker (array)
      "ressurs":         //formateres som link om gyldig (string)
    ]
  }
}
