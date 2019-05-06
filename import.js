/*

  executer le script :
  > node import.js

*/
var fs = require('fs'),
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/cinebamo';

MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
  if (err) throw err;
  
  var DB = client.db('cinebamo');
  // décommenter pour purger la collection avant import
  DB.collection('movies').drop();
  
  var h = 'Entry;title;Director;actors;date;nbOscars;IMDBLink;posterLink;country;category'.split(';') ;
  
  var datas = ("1;Brief Encounter;David Lean ;Celia Johnson, Cyril Raymond, Stanley Holloway, Trevor Howard;1945;;http://www.imdb.com/title/tt0037558/;http://www.guardian.co.uk/film/movie/35664/brief.encounter;UK;ROMANCE\n" +
    "2;Casablanca;Michael Curtiz;Claude Rains, Humphrey Bogart, Ingrid Bergman, Paul Henreid;1942;3;http://www.imdb.com/title/tt0034583/;http://www.guardian.co.uk/film/movie/36156/casablanca;USA;ROMANCE\n" +
    "3;Before Sunrise;Richard Linklater;Ethan Hawke and Julie Delpy;1995;;http://www.imdb.com/title/tt0112471/;http://www.guardian.co.uk/film/movie/58808/before-sunrise;USA;ROMANCE\n" +
    "3;Before Sunset;Richard Linklater;Ethan Hawke and Julie Delpy;2004;;http://www.imdb.com/title/tt0381681/awards;http://www.guardian.co.uk/film/movie/101181/before.sunset;USA;ROMANCE\n" +
    "4;Breathless;Jean-Luc Godard;Jean Seberg, Jean-Paul Belmondo;1960;;http://www.imdb.com/title/tt0053472/;http://www.guardian.co.uk/film/movie/36219/a-bout-de-souffle;France;ROMANCE\n" +
    "5;In the Mood for Love;Kar Wai Wong;Maggie Cheung Man-Yuk, Rebecca Pan, Tony Leung Chiu-Wai;2000;;http://www.imdb.com/title/tt0118694/;http://www.guardian.co.uk/film/movie/85442/in.the.mood.for.love;Hong Kong;ROMANCE\n" +
    "6;The Apartment;Billy Wilder;Fred MacMurray, Jack Lemmon, Ray Walston, Shirley MacLaine;1960;;http://www.imdb.com/title/tt0053604/;http://www.guardian.co.uk/film/movie/36225/apartment;USA;ROMANCE\n" +
    "7;Hannah & Her Sisters;Woody Allen ;Barbara Hershey, Carrie Fisher, Dianne Wiest, Julie Kavner, Mia Farrow, Michael Caine, Woody Allen;1986;3;http://www.imdb.com/title/tt0091167/;http://www.guardian.co.uk/film/movie/89162/hannah-and-her-sisters;USA;ROMANCE\n" +
    "8;Eternal Sunshine of the Spotless Mind;Michel Gondry;Elijah Wood, Jim Carrey, Kate Winslet, Kirsten Dunst, Mark Ruffalo, Tom Wilkinson;2004;1;http://www.imdb.com/title/tt0338013/;http://www.guardian.co.uk/film/movie/100140/eternal.sunshine.of.the.spotless.mind;USA;ROMANCE\n" +
    "9;Room With a View;James Ivory;Helena Bonham Carter, Julian Sands, Maggie Smith;1985;3;http://www.imdb.com/title/tt0091867/;http://www.guardian.co.uk/film/movie/77615/room-with-a-view;UK;ROMANCE\n" +
    "10;Jules et Jim;Fran�ois Truffaut;Henri Serre, Jeanne Moreau, Oscar Werner, Oskar Werner;1962;;http://www.imdb.com/title/tt0055032/;http://www.guardian.co.uk/film/movie/76699/jules.et.jim;France;ROMANCE\n" +
    "11;All That Heaven Allows;Douglas Sirk;Jane Wyman, Rock Hudson;1955;;http://www.imdb.com/title/tt0047811/;http://www.guardian.co.uk/film/movie/94875/all-that-heaven-allows;USA;ROMANCE\n" +
    "12;Gone with the Wind;Victor Fleming;Anne Rutherford, Clark Gable, Hattie McDaniel, Leslie Howard, Olivia De Havilland, Vivien Leigh;1939;8;http://www.imdb.com/title/tt0031381/;http://www.guardian.co.uk/film/movie/36144/gone.with.the.wind;USA;ROMANCE\n" +
    "13;An Affair to Remember;Leo McCarey;Cary Grant, Deborah Kerr, Richard Denning;1957;;http://www.imdb.com/title/tt0050105/;http://www.guardian.co.uk/film/movie/82271/affair.to.remember;USA;ROMANCE\n" +
    "14;Umbrellas of Cherbourg;Jaques Demy ;Anne Vernon, Catherine Deneuve, Nino Castelnuovo;1964;;http://www.imdb.com/title/tt0058450/;http://www.guardian.co.uk/film/movie/77848/umbrellas.of.cherbourg;France;ROMANCE\n" +
    "15;Lost in Translation;Sofia Coppola;Bill Murray, Giovanni Ribisi, Scarlett Johansson;2003;1;http://www.imdb.com/title/tt0335266/;http://www.guardian.co.uk/film/movie/96936/lost.in.translation;USA;ROMANCE\n" +
    "15;Roman Holiday;William Wyler;Audrey Hepburn, Gregory Peck;1953;3;http://www.imdb.com/title/tt0046250/;http://www.guardian.co.uk/film/movie/96156/roman-holiday;USA;ROMANCE\n" +
    "15;Wall-E;Andrew Stanton;Ben Burtt, Fred Willard, Jeff Garlin, Kathy Najimy, Sigourney Weaver;2008;1;http://www.imdb.com/title/tt0910970/;http://www.guardian.co.uk/film/movie/125194/wall-e;USA;ROMANCE\n" +
    "18;My Night With Maud;Eric Rohmer; Francoise Fabian, Jean-Louis Trintignant;1969;;http://www.imdb.com/title/tt0064612/;http://www.guardian.co.uk/film/movie/77331/my-night-with-maud;France;ROMANCE\n" +
    "19;Voyage to Italy;Roberto Rossellini;Ingrid Bergman;1954;;http://www.imdb.com/title/tt0046511/;http://www.guardian.co.uk/film/movie/88522/voyage-to-italy;Italy;ROMANCE\n" +
    "20;Dr Zhivago;David Lean;Geraldine Chaplin, Julie Christie, Omar Sharif;1965;5;http://www.imdb.com/title/tt0059113/;http://www.guardian.co.uk/film/movie/78519/dr-zhivago;USA;ROMANCE\n" +
    "21;Harold & Maude;Hal Ashby;Bud Cort, Cyril Cusack, Ruth Gordon, Vivian Pickles;1971;;http://www.imdb.com/title/tt0067185/;http://www.guardian.co.uk/film/movie/78471/harold-and-maude;USA;ROMANCE\n" +
    "22;When Harry Met Sally;Rob Reiner;Billy Crystal, Bruno Kirby, Carrie Fisher, Meg Ryan;1989;;http://www.imdb.com/title/tt0098635/;http://www.guardian.co.uk/film/movie/75869/when-harry-met-sally.;USA;ROMANCE\n" +
    "23;Say Anything....;Cameron crowe;John Cusack, Ione Skye, John Mahoney;1989;;http://www.imdb.com/title/tt0098258/;;USA;ROMANCE\n" +
    "24;Fabulous Baker Boys;Steve Kloves;Beau Bridges, Jeff Bridges, Michelle Pfeiffer;1989;;http://www.imdb.com/title/tt0097322/;http://www.guardian.co.uk/film/movie/134648/fabulous-baker-boys;USA;ROMANCE\n" +
    "25;A Matter of Life & Death; Emeric Pressburger, Michael Powell; David Niven, Kim Hunter, Raymond Massey, Richard Attenborough, Roger Livesey;1946;;http://www.imdb.com/title/tt0038733/;http://www.guardian.co.uk/film/movie/36173/matter.of.life.and.death;UK;ROMANCE\n" +
    "1;Chinatown;Roman Polanski;Faye Dunaway, Jack Nicholson, John Huston;1974;1;http://www.imdb.com/title/tt0071315/;http://www.guardian.co.uk/film/movie/36302/chinatown;USA;CRIME\n" +
    "2;Touch of Evil;Orson Welles;Charlton Heston, Janet Leigh, Marlene Dietrich, Orson Welles, Zsa Zsa Gabor;1958;;http://www.imdb.com/title/tt0052311/;http://www.guardian.co.uk/film/movie/36217/touch.of.evil;USA;CRIME\n" +
    "3;Vertigo;Alfred Hitchcock;Barbara Bel Geddes, James Stewart, Kim Novak;1958;;http://www.imdb.com/title/tt0052357/;http://www.guardian.co.uk/film/movie/34909/vertigo;USA;CRIME\n" +
    "4; Badlands;Terrence Malik;Alan Vint, Martin Sheen, Ramon Bieri, Sissy Spacek, Warren Oates;1973;;http://www.imdb.com/title/tt0069762/;http://www.guardian.co.uk/film/movie/76181/badlands;USA;CRIME\n" +
    "5;Rashomon;Akira Kurosawa;Machiko Kyo, Masayuki Mori, Toshiro Mifune;1950;;http://www.imdb.com/title/tt0042876/;http://www.guardian.co.uk/film/movie/83179/rashomon;Japan;CRIME\n" +
    "6;Double Indemnity;Billy Wilder;\"Porter Hall, Jean Heather, Byron Barr, Richard Gaines, John Philliber, Edward G.\n" +
    "Robinson, Fred MacMurray and Barbara Stanwyck\";1944;;http://www.imdb.com/title/tt0036775/;http://www.guardian.co.uk/film/movie/36162/double.indemnity;USA;CRIME\n" +
    "7;Get Carter;Mike Hodges;Brian Mosley, Britt Ekland, Geraldine Moffatt, John Osborne, Michael Caine;1971;;http://www.imdb.com/title/tt0067128/;http://www.guardian.co.uk/film/movie/36294/get.carter;UK;CRIME\n" +
    "8;Pulp Fiction;Quentin Tarantino;Amanda Plummer, Bruce Willis, Eric Stoltz, Harvey Keitel, John Travolta, Rosanna Arquette, Samuel L Jackson, Steve Buscemi, Tim Roth, Uma Thurman;1994;1;http://www.imdb.com/title/tt0110912/;http://www.guardian.co.uk/film/movie/56612/pulp.fiction;USA;CRIME\n" +
    "9;Hidden; Michael Haneke;Annie Girardot, Daniel Auteuil, Juliette Binoche, Maurice Benichou;2005;;http://www.imdb.com/title/tt0387898/;http://www.guardian.co.uk/film/movie/108597/hidden;France;CRIME\n" +
    "10;Goodfellas;Martin Scorsese; Frank Vincent, Joe Pesci, Lorraine Bracco, Ray Liotta, Robert De Niro;1990;1;http://www.imdb.com/title/tt0099685/;http://www.guardian.co.uk/film/movie/37702/goodfellas;USA;CRIME\n" +
    "11;The Conversation;Francis Coppola, Francis Ford Coppola;Allen Garfield, Gene Hackman, John Cazale;1974;;http://www.imdb.com/title/tt0071360/;http://www.guardian.co.uk/film/movie/77114/conversation;USA;CRIME\n" +
    "12;Bonnie & Clyde;Arthur Penn;Faye Dunaway, Gene Hackman, Michael J Pollard, Warren Beatty;1967;2;http://www.imdb.com/title/tt0061418/;http://www.guardian.co.uk/film/movie/76253/bonnie-and-clyde;USA;CRIME\n" +
    "13;The Killing;Stanley Kubrick; Coleen Gray, Elisha Cook Junior, Jay C Flippen, Sterling Hayden, Vince Edwards;1956;;http://www.imdb.com/title/tt0049406/;http://www.guardian.co.uk/film/movie/87920/killing;USA;CRIME\n" +
    "14;French Connection;William Friedkin;Fernando Rey, Gene Hackman, Roy Schieder, Tony Lo Bianco;1971;5;http://www.imdb.com/title/tt0067116/;http://www.guardian.co.uk/film/movie/36293/french-connection;USA;CRIME\n" +
    "15;The Big Sleep;Howard Hawkes;Bob Steele, Elisha Cook Jr, Elisha Cook Jr., Humphrey Bogart, Lauren Bacall;1946;;http://www.imdb.com/title/tt0038355/;http://www.guardian.co.uk/film/movie/34621/big-sleep;USA;CRIME\n" +
    "16;La Ceremonie;Claude Chabrol;Isabelle Huppert, Jacqueline Bisset, Sandrine Bonnaire;1995;;http://www.imdb.com/title/tt0112769/;http://www.guardian.co.uk/film/movie/80763/ceremonie;France;CRIME\n" +
    "17;Point Blank;John Boorman;Angie Dickinson, Keenan Wynn, Lee Marvin;1967;;http://www.imdb.com/title/tt0062138/;http://www.guardian.co.uk/film/movie/36266/point-blank;USA;CRIME\n" +
    "18;Hard Boiled;John Woo;Chow Yun Fat, Tony Leung;1992;;http://www.imdb.com/title/tt0104684/;http://www.guardian.co.uk/film/movie/82687/hard-boiled;Hong Kong;CRIME\n" +
    "19;Long Good Friday;John McKenzie;Bob Hoskins, Bryan Marshall, Dave King, Helen Mirren;1980;;http://www.imdb.com/title/tt0081070/;http://www.guardian.co.uk/film/movie/36322/long.good.friday;UK;CRIME\n" +
    "20;A Prophet;Jacques Audiard ;Adel Bencherif, Niels Arestrup, Tahar Rahim, Tahar Ramin;2009;;http://www.imdb.com/title/tt1235166/;http://www.guardian.co.uk/film/movie/129970/prophet;France;CRIME\n" +
    "20;Heat;Michael Mann;Al Pacino, Ashley Judd, Jon Voight, Robert De Niro, Tom Sizemore, Val Kilmer;1995;;http://www.imdb.com/title/tt0113277/;http://www.guardian.co.uk/film/movie/60365/heat;USA;CRIME\n" +
    "20;Scarface (1983);Brian De Palma;Al Pacino, Mary Elizabeth Mastrantonio, Michelle Pfeiffer, Robert Loggia, Steven Bauer;1983;;http://www.imdb.com/title/tt0086250/;http://www.guardian.co.uk/film/movie/78370/scarface;USA;CRIME\n" +
    "23;Miller�s Crossing;Joel Coen;Albert Finney, Gabriel Byrne, Marcia Gay Harden;1990;;http://www.imdb.com/title/tt0100150/;http://www.guardian.co.uk/film/movie/78569/miller.s.crossing;USA;CRIME\n" +
    "24;Postman Always Rings Twice  (1942);Tay Garnett;Cecil Kellaway, John Garfield, Lana Turner;1946;;http://www.imdb.com/title/tt0038854/;http://www.guardian.co.uk/film/movie/90190/postman-always-rings-twice;USA;CRIME\n" +
    "25;Jour Se Leve;Marcel Carne;Annabella, Arletty, Jean Gabin;1939;;http://www.imdb.com/title/tt0031514/;http://www.guardian.co.uk/film/movie/76684/jour-se-leve;France;CRIME\n" +
    "1;Annie Hall;Woody Allen;Carol Kane, Diane Keaton, Paul Simon, Tony Roberts, Woody Allen;1977;4;http://www.imdb.com/title/tt0075686/;http://www.guardian.co.uk/film/movie/36314/annie.hall;USA;COMEDY\n" +
    "2;Borat;Larry Charles;Ken Davitian, Pamela Anderson , Sacha Baron Cohen;2006;;http://www.imdb.com/title/tt0443453/;http://www.guardian.co.uk/film/movie/114557/borat;USA;COMEDY\n" +
    "3;Some Like it Hot;Billy Wilder;George Raft, Jack Lemmon, Joe E Brown, Marilyn Monroe, Tony Curtis;1959;1;http://www.imdb.com/title/tt0053291/;http://www.guardian.co.uk/film/movie/36223/some.like.it.hot;USA;COMEDY\n" +
    "4;Team America;Trey Parker;Kristen Miller, Matt Stone, Trey Parker;2004;;http://www.imdb.com/title/tt0372588/;http://www.guardian.co.uk/film/movie/103000/team.america;USA;COMEDY\n" +
    "5;Dr Strangelove;Stanley Kubrick;George C Scott, Peter Sellers, Sterling Hayden;1964;;http://www.imdb.com/title/tt0057012/;http://www.guardian.co.uk/film/movie/76390/dr-strangelove;UK;COMEDY\n" +
    "5;The Ladykillers;Alexander Mackendrick;Alec Guinness, Cecil Parker, Herbert Lom, Peter Sellers;1955;;http://www.imdb.com/title/tt0048281/;http://www.guardian.co.uk/film/movie/36206/ladykillers;UK;COMEDY\n" +
    "7;Duck Soup;Leo McCarey;Chico Marx, Groucho Marx, Harpo Marx, Margaret Dumont, The Marx Brothers, Zeppo Marx;1933;;http://www.imdb.com/title/tt0023969/;http://www.guardian.co.uk/film/movie/36133/duck.soup;USA;COMEDY\n" +
    "7;Rushmore;Wes Anderson; Bill Murray, Brian Cox, Jason Schwartzman, Olivia Williams;1998;;http://www.imdb.com/title/tt0128445/;http://www.guardian.co.uk/film/movie/79577/rushmore;USA;COMEDY\n" +
    "9;Kind Hearts & Coronets;Robert Hamer;Alec Guinness, Dennis Price, Joan Greenwood;1949;;http://www.imdb.com/title/tt0041546/;http://www.guardian.co.uk/film/movie/36180/kind-hearts-and-coronets;UK;COMEDY\n" +
    "10;Monty Python�s Life of Brian;Terry Jones;Eric Idle, Graham Chapman, John Cleese, Michael Palin, Terry Gilliam, Terry Jones;1979;;http://www.imdb.com/title/tt0079470/;http://www.guardian.co.uk/film/movie/78168/monty-python-s-life-of-brian;UK;COMEDY\n" +
    "11;Airplane!;Jim Abrahams, David Zucker and Jerry Zucker;Julie Hagerty, Leslie Nielsen, Robert Hays;1980;;http://www.imdb.com/title/tt0080339/;http://www.guardian.co.uk/film/movie/83228;USA;COMEDY\n" +
    "12;Election;Alexander Payne;Chris Klein, Matthew Broderick, Reese Witherspoon;1999;;http://www.imdb.com/title/tt0126886/;http://www.guardian.co.uk/film/movie/79657/election;USA;COMEDY\n" +
    "12;His Girl Friday;Howard Hawkes;Cary Grant, Gene Lockhart, Ralph Bellamy, Rosalind Russell;1940;;http://www.imdb.com/title/tt0032599/;http://www.guardian.co.uk/film/movie/76369/his-girl-friday;USA;COMEDY\n" +
    "12;The Big Lebowski;Joel Coen;Jeff Bridges, John Goodman, Julianne Moore, Steve Buscemi;1998;;http://www.imdb.com/title/tt0118715/;http://www.guardian.co.uk/film/movie/77069/big.lebowski;USA;COMEDY\n" +
    "15;This Is Spinal Tap;Rob Reiner; Christopher Guest, Harry Shearer, Michael McKean, Rob Reiner;1984;;http://www.imdb.com/title/tt0088258/;http://www.guardian.co.uk/film/movie/81384/this.is.spinal.tap;USA;COMEDY\n" +
    "16;Bringing Up Baby;Howard Hawkes;Cary Grant, Katharine Hepburn, Katherine Hepburn;1938;;http://www.imdb.com/title/tt0029947/;http://www.guardian.co.uk/film/movie/36143/bringing-up-baby;USA;COMEDY\n" +
    "17;There�s Something About Mary;Peter & Bob Farrelly;Ben Stiller, Cameron Diaz, Lee Evans, Matt Dillon;1998;;http://www.imdb.com/title/tt0129387/;http://www.guardian.co.uk/film/movie/34359/there.s.something.about.mary;USA;COMEDY\n" +
    "18;Dazed and Confused;Richard Linklater;Adam Goldberg, Jason London, Joey Lauren Adams, Joey Lauren Adams, Milla Jovovich, Rory Cochrane, Shawn Andrew;1993;;http://www.imdb.com/title/tt0106677/;http://www.guardian.co.uk/film/movie/49047/dazed-and-confused;USA;COMEDY\n" +
    "18;MASH;Robert Altman;Donald Sutherland, Elliott Gould, Sally Kellerman;1970;1;http://www.imdb.com/title/tt0066026/;http://www.guardian.co.uk/film/movie/84547;USA;COMEDY\n" +
    "20;Groundhog Day;Harold Ramis;Andie MacDowell, Bill Murray, Chris Elliott, Stephen Tobolowsky;1993;;http://www.imdb.com/title/tt0107048/;http://www.guardian.co.uk/film/movie/79383/groundhog-day;USA;COMEDY\n" +
    "21;Clueless;Amy Heckerling;Alicia Silverstone, Dan Hedaya, Stacey Dash;1995;;http://www.imdb.com/title/tt0112697/;http://www.guardian.co.uk/film/movie/59257/clueless;USA;COMEDY\n" +
    "22;The Great Dictator;Charlie Chaplin;Charlie Chaplin, Jack Oakie, Paulette Goddard;1940;;http://www.imdb.com/title/tt0032553/;http://www.guardian.co.uk/film/movie/96585/great.dictator;USA;COMEDY\n" +
    "23;Clerks;Kevin Smith;Brian O'Halloran, Jeff Anderson, Marilyn Ghigliotti;1994;;http://www.imdb.com/title/tt0109445/;http://www.guardian.co.uk/film/movie/53831/clerks;USA;COMEDY\n" +
    "24;The Jerk;Carl Reiner;Steve Martin;1979;;http://www.imdb.com/title/tt0079367/;http://www.guardian.co.uk/film/movie/88834/jerk;USA;COMEDY\n" +
    "25;Shaun of the Dead;Edgar Wright;Dylan Moran, Kate Ashfield, Nick Frost, Simon Pegg;2004;;http://www.imdb.com/title/tt0365748/;http://www.guardian.co.uk/film/movie/99960/shaun.of.the.dead;UK;COMEDY\n" +
    "1;Apocalypse Now;Francis Coppola;Dennis Hopper, Frederic Forrest, Laurence Fishburne, Marlon Brando, Martin Sheen, Robert Duvall, Rpobert Duvall;1979;2;http://www.imdb.com/title/tt0078788/;http://www.guardian.co.uk/film/movie/36320/apocalypse.now;USA;ACTION\n" +
    "2;North by Northwest;Alfred Hitchcock; Cary Grant, Eva Marie Saint, Eva Marie Saint, James Mason, Jessie Royce Landis, Leo G Carroll, Martin Landau;1959;;http://www.imdb.com/title/tt0053125/;http://www.guardian.co.uk/film/movie/35095/north-by-northwest;USA;ACTION\n" +
    "3;Once Upon a Time in the West;Sergio Leone;Charles Bronson, Claudia Cardinale, Henry Fonda, Jason Robards;1968;;http://www.imdb.com/title/tt0064116/;http://www.guardian.co.uk/film/movie/36274/once.upon.a.time.in.the.west;Italy;ACTION\n" +
    "4;The Wild Bunch;Sam Pekinpah;Ernest Borgnine, Robert Ryan, William Holden;1969;;http://www.imdb.com/title/tt0065214/;http://www.guardian.co.uk/film/movie/36285/wild.bunch;USA;ACTION\n" +
    "5;Deliverance;John Boorman ;Burt Reynolds, Jon Voight, Ned Beatty;1972;;http://www.imdb.com/title/tt0068473/;http://www.guardian.co.uk/film/movie/76560/deliverance;USA;ACTION\n" +
    "6;City of God;Fernando Meirelles;Alexandre Rodrigues, Leandro Firmino da Hora, Matheus Nachtergaele, Phelipe Haagensen;2002;;http://www.imdb.com/title/tt0317248/;http://www.guardian.co.uk/film/movie/94028/city.of.god;Brazil;ACTION\n" +
    "7;Paths of Glory;Stanley Kubrick;Adolphe Menjou, Kirk Douglas, Ralph Meeker;1957;;http://www.imdb.com/title/tt0050825/;http://www.guardian.co.uk/film/movie/76931/paths.of.glory;USA;ACTION\n" +
    "7;The Wages of Fear;Henri-Georges Clouzot;Charles Vanel, Folco Lulli, Yves Montand;1953;;http://www.imdb.com/title/tt0046268/;http://www.guardian.co.uk/film/movie/78592/wages-of-fear;France;ACTION\n" +
    "9;Crouching Tiger Hidden Dragon;Ang Lee;Chang Chen, Chow Yun-Fat, Michelle Yeoh, Zhang Ziyi, Ziyi Zhang;2000;4;http://www.imdb.com/title/tt0190332/;http://www.guardian.co.uk/film/movie/86383/crouching.tiger.hidden.dragon;Taiwan;ACTION\n" +
    "10; The Thin Red Line;Terrence Malik;Adrien Brody, Ben Chaplin, Nick Nolte, Sean Penn;1998;;http://www.imdb.com/title/tt0120863/;http://www.guardian.co.uk/film/movie/74795/thin.red.line;USA;ACTION\n" +
    "11;Raiders of the Lost Ark;Steven Spielberg;Harrison Ford, Karen Allen, Paul Freeman, Ronald Lacey;1981;4;http://www.imdb.com/title/tt0082971/;http://www.guardian.co.uk/film/movie/36332/raiders-of-the-lost-ark;USA;ACTION\n" +
    "12; Bullitt;Peter Yates;Jacqueline Bisset, Robert Vaughn, Steve McQueen;1968;1;http://www.imdb.com/title/tt0062765/;http://www.guardian.co.uk/film/movie/76966/bullitt;USA;ACTION\n" +
    "12;Ran;Akira Kurosawa;Akira Terao, Daisuke Ryu, Mieko Harada, Tatsuya Nakadai;1985;1;http://www.imdb.com/title/tt0089881/;http://www.guardian.co.uk/film/movie/76633/ran;Japan;ACTION\n" +
    "14;Die Hard;John McTeirnan;Alan Rickman, Bonnie Bedelia, Bruce Willis;1988;;http://www.imdb.com/title/tt0095016/;http://www.guardian.co.uk/film/movie/80851/die-hard;Japan;ACTION\n" +
    "15;The Adventures of Robin Hood;Michael Curtiz, William Keighley;Basil Rathbone, Claude Rains, Errol Flynn, Olivia De Havilland, Olivia de Havilland, William Keighley;1938;3;http://www.imdb.com/title/tt0029843/;http://www.guardian.co.uk/film/movie/34500/adventures-of-robin-hood;USA;ACTION\n" +
    "16; The Searchers;John Ford;Jeffrey Hunter, John Wayne, Natalie Wood, Vera Miles, Ward Bond;1956;;http://www.imdb.com/title/tt0049730/;http://www.guardian.co.uk/film/movie/115097/searchers;USA;ACTION\n" +
    "17;Goldfinger;Guy Hamilton; Bernard Lee, Gert Frobe, Harold Sakata, Honor Blackman, Lois Maxwell, Sean Connery, Shirley Eaton, Tania Mallet;1964;1;http://www.imdb.com/title/tt0058150/;http://www.guardian.co.uk/film/movie/79341/goldfinger;UK;ACTION\n" +
    "18;Full Metal Jacket;Stanley Kubrick;Adam Baldwin, Lee Ermey, Matthew Modine, Vincent D'Onofrio;1987;;http://www.imdb.com/title/tt0093058/;http://www.guardian.co.uk/film/movie/76429/full-metal-jacket;USA;ACTION\n" +
    "18;Last of the Mohicans;Michael Mann;Daniel Day-Lewis, Jodhi May, Madeleine Stowe;1992;1;http://www.imdb.com/title/tt0104691/;http://www.guardian.co.uk/film/movie/79330/last-of-the-mohicans;;ACTION\n" +
    "20;Deer Hunter;Michael Cimino;Christopher Walken, Meryl Streep, Robert De Niro;1978;5;http://www.imdb.com/title/tt0077416/;http://www.guardian.co.uk/film/movie/36318/deer-hunter;USA;ACTION\n" +
    "21;Gladiator;Ridley Scott;Connie Nielsen, Joaquin Phoenix, Oliver Reed, Russell Crowe;2000;5;http://www.imdb.com/title/tt0172495/;http://www.guardian.co.uk/film/movie/83550/gladiator;USA;ACTION\n" +
    "22;Rome Open City;Roberto Rossellini;Aldo Fabrizi, Anna Magnani, Marcello Pagliero;1945;;http://www.imdb.com/title/tt0038890/;http://www.guardian.co.uk/film/movie/78859/rome-open-city;Italy;ACTION\n" +
    "23;Butch Cassidy;George Roy Hill;Katharine Ross, Paul Newman, Robert Redford;1969;4;http://www.imdb.com/title/tt0064115/;http://www.guardian.co.uk/film/movie/36276/butch-cassidy-and-the-sundance-kid;USA;ACTION\n" +
    "23;Where Eagles Dare;Brian G. Hutton;Clint Eastwood, Mary Ure, Richard Burton;1968;;http://www.imdb.com/title/tt0065207/;http://www.guardian.co.uk/film/movie/83199/where-eagles-dare;USA;ACTION\n" +
    "25;The Incredibles;Brad Bird;Craig T Nelson, Holly Hunter, Jason Lee, Samuel L Jackson;2004;2;http://www.imdb.com/title/tt0317705/;http://www.guardian.co.uk/film/movie/102423/incredibles;USA;ACTION\n" +
    "1;Andrei Rublev;Andrei Tarkovsky;Anatoli Solonitsyn, Andrei Mikhalkov-Konchalovsky, Andrei Tarkovsky, Ivan Lapikov, Nikolai Grinko;1966;;http://www.imdb.com/title/tt0060107/;http://www.guardian.co.uk/film/movie/76518/andrei.rublev;Soviet Union;DRAME\n" +
    "2;Mulholland Dr;David Lynch;Justin Theroux, Laura Harring, Naomi Watts;2001;;http://www.imdb.com/title/tt0166924/;http://www.guardian.co.uk/film/movie/90677/mulholland.drive;France;DRAME\n" +
    "3;L�Atalante;Jean Vigo;Dita Parlo, Jean Daste, Michel Simon;1934;;http://www.imdb.com/title/tt0024844/;http://www.guardian.co.uk/film/movie/105996/atalante;France;DRAME\n" +
    "4;Tokyo Story;Yasujiro Ozu; Chieko Higashiyama, Chishu Ryu, Setsuko Hara, Toru Abu;1953;;http://www.imdb.com/title/tt0046438/;http://www.guardian.co.uk/film/movie/36199/tokyo.story;Japan;DRAME\n" +
    "5;Citizen Kane;Orson Welles; Dorothy Comingore, Everett Sloane, Joseph Cotten, Orson Welles;1941;1;http://www.imdb.com/title/tt0033467/;http://www.guardian.co.uk/film/movie/76006/citizen.kane;USA;DRAME\n" +
    "6;A Clockwork Orange;Stanley Kubrick;Adrienne Corri, Malcolm McDowell, Michael Bates, Patrick Magee, Warren Clarke;1971;;http://www.imdb.com/title/tt0066921/;http://www.guardian.co.uk/film/movie/75644/clockwork.orange;USA;DRAME\n" +
    "7;Days of Heaven;Terrence Malik;Brooke Adams, Richard Gere, Sam Shepard;1978;1;http://www.imdb.com/title/tt0077405/;http://www.guardian.co.uk/film/movie/76235/days-of-heaven;USA;DRAME\n" +
    "8;Wild Strawberries;Ingmar Bergman;Bibi Anderson, Bibi Andersson, Gunnar Bjornstrand, Ingrid Thulin, Victor Sjostrom;1957;;http://www.imdb.com/title/tt0050986/;http://www.guardian.co.uk/film/movie/79108/wild-strawberries;Sweden;DRAME\n" +
    "9;White Ribbon;Michael Haneke;Burghart Klaussner, Christian Friedel, Josef Bierbichler, Susanne Lothar, Ulrich Tukur;2009;;http://www.imdb.com/title/tt1149362/;http://www.guardian.co.uk/film/movie/130013/white-ribbon;Germany;DRAME\n" +
    "10;The Gospel According to St Matthew;Pier Paolo Pasolini; Enrique Irazoqui, Margherita Caruso;1964;;http://www.imdb.com/title/tt0058715/;http://www.guardian.co.uk/film/movie/76223/gospel-according-to-st-matthew;Italy;DRAME\n" +
    "11;Aguirre Wrath of God;Werner Herzog; Cecilia Rivera, Klaus Kinski, Ruy Guerra;1972;;http://www.imdb.com/title/tt0068182/;http://www.guardian.co.uk/film/movie/82250/aguirre.wrath.of.god;Germany;DRAME\n" +
    "11;Pather Panchali;Satyajit Ray; Kanu Bannerjee, Karuna Bannerjee, Uma Das Gupta;1955;;http://www.imdb.com/title/tt0048473/;http://www.guardian.co.uk/film/movie/78996/pather.panchali;India;DRAME\n" +
    "13;The Conformist;Bernado Bertolucci;Dominique Sanda, Gastone Moschin, Jean-Louis Trintignant, Louis Trintignant, Stefania Sandrelli;1970;;http://www.imdb.com/title/tt0065571/;http://www.guardian.co.uk/film/movie/36277/conformist;Italy;DRAME\n" +
    "14;Death in Venice;Luchino Visconti;Bjorn Andresen, Dirk Bogarde, Marisa Berensen, Silvana Mangano;1971;;http://www.imdb.com/title/tt0067445/;http://www.guardian.co.uk/film/movie/85500/death.in.venice;Italy;DRAME\n" +
    "15;The Godfather Parts I and II;Francis Ford Coppola;Al Lettieri, Al Pacino, Diane Keaton, James Caan, John Cazale, Marlon Brando, Robert Duvall, Talia Shire;1972;9;http://www.imdb.com/title/tt0068646/;http://www.guardian.co.uk/film/movie/36295/godfather;USA;DRAME\n" +
    "16;The Graduate;Mike Nichols;Anne Bancroft, Dustin Hoffman, Katharine Ross, William Daniels;1967;1;http://www.imdb.com/title/tt0061722/;http://www.guardian.co.uk/film/movie/36264/graduate;USA;DRAME\n" +
    "16;There Will Be Blood;Paul Thomas Anderson; Daniel Day Lewis, Daniel Day-Lewis, Dillon Freasier, Kevin J O'Connor, Paul Dano;2007;2;http://www.imdb.com/title/tt0469494/;http://www.guardian.co.uk/film/movie/122167/there.will.be.blood;USA;DRAME\n" +
    "18;Battleship Potemkin;Sergei Eisenstein;A Antonov, Alexandr Antonov, Grigori Alexandrov, Midhail Gomorov, Vladimir Barsky;1925;;http://www.imdb.com/title/tt0015648/;http://www.guardian.co.uk/film/movie/36125/battleship-potemki;Soviet Union;DRAME\n" +
    "19;Rules of the Game;Jean Renoir;Nora Gregor, Paulette Dubost, Mila Parely.;1939;;http://www.imdb.com/title/tt0031885/;http://www.guardian.co.uk/film/movie/82918/rules-of-the-game;USA;DRAME\n" +
    "19; Shadows;;;;;;;;DRAME\n" +
    "21;Distant Voices Still Lives;Terence davies;Angela Walsh, Dean Williams, Freda Dowie, Lorraine Ashbourne, Pete Postlethwaite;1988;;http://www.imdb.com/title/tt0095037/;http://www.guardian.co.uk/film/movie/36360/distant-voices-still-lives;UK;DRAME\n" +
    "22;Passion of Joan of Arc;Carl Theodor Dreyer;Eugene Silvain, Maria Falconetti, Michael Simon, Michel Simon, Renee Falconetti;1928;;http://www.imdb.com/title/tt0019254/;http://www.guardian.co.uk/film/movie/81498/passion.of.joan.of.arc;France;DRAME\n" +
    "23;La Dolce Vita;Federico Fellini;Anita Ekberg, Anouk Aimee, Marcello Mastroianni;1960;1;http://www.imdb.com/title/tt0053779/;http://www.guardian.co.uk/film/movie/76949/dolce.vita;Italy;DRAME\n" +
    "24;Breaking the Waves;Lars Von Trier;Emily Watson, Katrin Cartlidge, Stellan Skarsgard;1996;;http://www.imdb.com/title/tt0115751/;http://www.guardian.co.uk/film/movie/64085/breaking-the-waves;Denmark;DRAME\n" +
    "25;Spirit of the Beehive;Victor Erice;Ana Torrent, Fernando Fernan, Fernando Fernan Gomez, Fernando Fernan Gomez, Isabel Telleria;1973;;http://www.imdb.com/title/tt0070040/;http://www.guardian.co.uk/film/movie/76634/spirit.of.the.beehive;Spain;DRAME\n" +
    "1;2001;Stanley Kubrick;Daniel Richter, Gary Lockwood, Keir Dullea, William Sylvester;1968;1;http://www.imdb.com/title/tt0062622/;http://www.guardian.co.uk/film/movie/36269/2001;USA;SCI-FI\n" +
    "2;Metropolis;Fritz Lang;Alfred Abel, Brigitte Helm, Gustav Frohlich, Gustav Fruhlich;1927;;http://www.imdb.com/title/tt0017136/;http://www.guardian.co.uk/film/movie/75782/metropolis;Germany;SCI-FI\n" +
    "3;Blade Runner;Ridley Scott;Harrison Ford, Rutger Hauer, Sean Young;1982;;http://www.imdb.com/title/tt0083658/;http://www.guardian.co.uk/film/movie/76627/blade-runner;USA;SCI-FI\n" +
    "4;Alien;Ridley Scott;Ian Holm, John Hurt, Sigourney Weaver, Tom Skerritt;1979;1;http://www.imdb.com/title/tt0078748/;http://www.guardian.co.uk/film/movie/75860/alien;USA;SCI-FI\n" +
    "5;The Wizard of Oz;Victor Fleming;Bert Lahr, Frank Morgan, Jack Haley, Judy Garland, Ray Bolger;1939;2;http://www.imdb.com/title/tt0032138/;http://www.guardian.co.uk/film/movie/36148/wizard.of.oz;USA;SCI-FI\n" +
    "6;ET;Steven Spielberg;Dee Wallace, Drew Barrymore, Henry Thomas, Peter Coyote;1982;4;http://www.imdb.com/title/tt0083866/;http://www.guardian.co.uk/film/movie/92910/e.t.the.extra-terrestrial;USA;SCI-FI\n" +
    "6;Solaris; Andrei Tarkovsky;Donatas Banionis, Juri Jarvet, Nataly Bondarchuk, Natalya Bondarchuk;1972;;http://www.imdb.com/title/tt0069293/;http://www.guardian.co.uk/film/movie/76558/solaris;USA;SCI-FI\n" +
    "8;Spirited Away;Hayao Miyazaki;Daveigh Chase, Jason Marsden, Jason Marsdon, Mari Natsuki, Miyu Irino, Rumi Hiragi, Suzanne Pleshette;2001;1;http://www.imdb.com/title/tt0245429/;http://www.guardian.co.uk/film/movie/96263/spirited.away;Japan;SCI-FI\n" +
    "9;Star Wars  (1977);George Lucas;Alec Guinness, Carrie Fisher, David Prowse, Harrison Ford, Mark Hamill, Peter Cushing, Peter Mayhew;1977;6;http://www.imdb.com/title/tt0076759/;http://www.guardian.co.uk/film/movie/36316/star.wars;USA;SCI-FI\n" +
    "10;Close Encounters;Steven Spielberg;Melinda Dillon, Richard Dreyfuss;1977;1;http://www.imdb.com/title/tt0075860/;http://www.guardian.co.uk/film/movie/36315/close-encounters-of-the-third-kind;USA;SCI-FI\n" +
    "10;King Kong;Ernest B Schoedsack, Merian C Cooper;Bruce Cabot, Ernest B Schoedsack, Fay Wray, Frank Reicher, James Flavin, John Armstrong, Noble Jhonson, Robert Armstrong;1933;;http://www.imdb.com/title/tt0024216/;http://www.guardian.co.uk/film/movie/36134/king.kong;USA;SCI-FI\n" +
    "12;Terminator/Terminator 2;James Cameron;Arnold Schwarzenegger, Linda Hamilton, Michael Biehn;1991;4;http://www.imdb.com/title/tt0088247/;http://www.guardian.co.uk/film/movie/88018/terminator;USA;SCI-FI\n" +
    "13;The Matrix;Andy & Larry Wachowski;Carrie-Anne Moss, Keanu Reeves, Laurence Fishburne;1999;4;http://www.imdb.com/title/tt0133093/;http://www.guardian.co.uk/film/movie/77528/matrix;USA;SCI-FI\n" +
    "14;Alphaville;Jean Luc-Godard;Anna Karina, Eddie Constantine;1965;;http://www.imdb.com/title/tt0058898/;http://www.guardian.co.uk/film/movie/75764/alphaville;France;SCI-FI\n" +
    "15;Back to the Future;Robert Zemeckis;Christopher Lloyd, Crispin Glover, Lea Thompson, Michael J Fox, Michael J. Fox;1985;1;http://www.imdb.com/title/tt0088763/;http://www.guardian.co.uk/film/movie/78042/back-to-the-future;USA;SCI-FI\n" +
    "16;Planet of the Apes;Franklin J Schaffner ;Charlton Heston, Kim Hunter, Roddy McDowell;1968;1;http://www.imdb.com/title/tt0063442/;http://www.guardian.co.uk/film/movie/95819/planet-of-the-apes;USA;SCI-FI\n" +
    "17;Brazil;Terry Gilliam;Jonathan Pryce, Michael Palin, Robert De Niro;1985;;http://www.imdb.com/title/tt0088846/;http://www.guardian.co.uk/film/movie/79920/brazil;UK;SCI-FI\n" +
    "18;The Lord of the Rings trilogy;Peter Jackson;Cate Blanchett, Dominic Monaghan, Elijah Wood, Hugo Weaving, John Rhys-Davies, Liv Tyler, Miranda Otto, Orlando Bloom, Sean Astin, Sir Ian McKellen, Viggo Mortensen, William Boyd;2003;17;http://www.imdb.com/title/tt0167260/;http://www.guardian.co.uk/film/movie/92716/lord.of.the.rings;New Zealand;SCI-FI\n" +
    "19;Dark Star;John Carpenter;Brian Narelle, Dan O'Bannon, Dre Pahich;1974;;http://www.imdb.com/title/tt0069945/;http://www.guardian.co.uk/film/movie/77501/dark-star;USA;SCI-FI\n" +
    "20;Day the Earth Stood Still;Robert Wise;Hugh Marlowe, Lock Martin, Michael Rennie, Patricia Neal;1951;;http://www.imdb.com/title/tt0043456/;http://www.guardian.co.uk/film/movie/82253/day-the-earth-stood-still;USA;SCI-FI\n" +
    "21;Edward Scissorhands;Tim Burton;Dianne Wiest, Johnny Depp, Winona Ryder;1990;;http://www.imdb.com/title/tt0099487/;http://www.guardian.co.uk/film/movie/82335/edward.scissorhands;USA;SCI-FI\n" +
    "22;Akira;Katsuhiro Otomo;Mitsuo Iwata, Nozomu Sasaki, Mami Koyama, Tessho Genda;1988;;http://www.imdb.com/title/tt0094625/;http://www.guardian.co.uk/film/movie/76882/akira;Japan;SCI-FI\n" +
    "23;Princess Bride;Rob reiner;Billy Crystal, Carty Elwes, Cary Elwes, Mandy Patinkin, Peter Falk, Robin Wright;1987;;http://www.imdb.com/title/tt0093779/;http://www.guardian.co.uk/film/movie/77070/princess-bride;USA;SCI-FI\n" +
    "24;Pan�s Labyrinth;Guillermo del Toro; Ariadna Gil, Doug Jones, Ivana Baquero, Maribel Verdu, Sergi Lopez;2006;3;http://www.imdb.com/title/tt0457430/;http://www.guardian.co.uk/film/movie/112345/pan.s.labyrinth;Spain;SCI-FI\n" +
    "25;Starship Troopers;Paul Verhoeven;Casper Van Dien, Clancy Brown, Dina Meyer, Jake Busey, Michael Ironside;1997;;http://www.imdb.com/title/tt0120201/;http://www.guardian.co.uk/film/movie/71806/starship-troopers;USA;SCI-FI\n" +
    "1;Psycho;Alfred Hitchcock;Anthony Perkins, Janet Leigh, Vera Miles;1960;;http://www.imdb.com/title/tt0054215/;http://www.guardian.co.uk/film/movie/34630/psycho;USA;HOROR\n" +
    "2;Rosemary�s Baby;Roman Polanski;John Cassavetes, Mia Farrow, Ruth Gordon;1968;1;http://www.imdb.com/title/tt0063522/;http://www.guardian.co.uk/film/movie/80947/rosemary-s-baby;USA;HOROR\n" +
    "3;Don�t Look Now;Nicholas Roeg;Donald Sutherland, Hilary Mason, Julie Christie;1973;;http://www.imdb.com/title/tt0069995/;http://www.guardian.co.uk/film/movie/35097/don.t.look.now;UK;HOROR\n" +
    "4;The Wicker Man;Robin Hardy;Britt Ekland, Christopher Lee, Edward Woodward;1973;;http://www.imdb.com/title/tt0070917/;http://www.guardian.co.uk/film/movie/36301/wicker.man;UK;HOROR\n" +
    "5;The Shining;Stanley Kubrick;Danny Lloyd, Jack Nicholson, Shelley Duval;1980;;http://www.imdb.com/title/tt0081505/;http://www.guardian.co.uk/film/movie/76626/shining;USA;HOROR\n" +
    "6;The Exorcist;William Friedkin;Ellen Burstyn, Linda Blair, Max von Sydow;1973;2;http://www.imdb.com/title/tt0070047/;http://www.guardian.co.uk/film/movie/86477/exorcist;USA;HOROR\n" +
    "7;Nosferatu  (1922);FW Mernau;Alexander Granach, Greta Schroder, Gustav von Wangenheim, Max Schreck;1922;;http://www.imdb.com/title/tt0013442/;http://www.guardian.co.uk/film/movie/75839/nosferatu;Germany;HOROR\n" +
    "8;Let the Right One In;Tomas Alfredson; Henrik Dahl, Kare Hedebrant, Karin Bergquist, Lina Leandersson, Per Ragnar, Peter Carlberg;2008;;http://www.imdb.com/title/tt1139797/;http://www.guardian.co.uk/film/movie/125671/let-the-right-one-in;Sweden;HOROR\n" +
    "9;Vampyr;Carl Theodor Dreyer;Henriette G�rard, Henriette Gerard, Julian West, Sybille Schmitz;1932;;http://www.imdb.com/title/tt0023649/;http://www.guardian.co.uk/film/movie/80562/vampyr;Germany;HOROR\n" +
    "10;Peeping Tom;Michael Powell;Anna Massey, Carl Boehm, Esmond Knight, Karl Bohm, Maxine Audley, Moira Shearer;1960;;http://www.imdb.com/title/tt0054167/;http://www.guardian.co.uk/film/movie/36228/peeping-tom;UK;HOROR\n" +
    "11;The Innocents;Jack Clayton;Clytie Jessop, Deborah Kerr, Michael Redgrave, Peter Wyngarde;1961;;http://www.imdb.com/title/tt0055018/;http://www.guardian.co.uk/film/movie/77279/innocents;USA;HOROR\n" +
    "12;Ringu;Hideo Nakata;Nanako Matsushima, Hiroyuki Sanada,  Rikiya Otaka;1998;;http://www.imdb.com/title/tt0178868/;http://www.guardian.co.uk/film/movie/121191/ringu;Japan;HOROR\n" +
    "13;The Haunting;Robert Wise;Claire Bloom, Julie Harris, Richard Johnson;1963;;http://www.imdb.com/title/tt0057129/;http://www.guardian.co.uk/film/movie/99697/haunting;USA;HOROR\n" +
    "14;Texas Chainsaw Massacre;Tobe Hooper; Edwin Neal, Jim Siedow, Marilyn Burns, Paul A Partain;1974;;http://www.imdb.com/title/tt0072271/;http://www.guardian.co.uk/film/movie/82763/texas-chainsaw-massacre;USA;HOROR\n" +
    "15;Dead of Night;Alberto Cavalcanti, Charles Crichton;Googie Withers, Mervyn Johns, Michael Redgrave;1945;;http://www.imdb.com/title/tt0037635/;http://www.guardian.co.uk/film/movie/79561/dead.of.night;UK;HOROR\n" +
    "16;The Cabinet of Dr Caligari;Robert Wiene;Conrad Veidt, Lil Dagover, Werner Krauss;1920;;http://www.imdb.com/title/tt0010323/;http://www.guardian.co.uk/film/movie/77300/cabinet-of-dr-caligari;Germany;HOROR\n" +
    "17;Halloween;John Carpenter;Donald Pleasance, Donald Pleasence, Jamie Lee Curtis, Nancy Loomis, Tony Moran;1978;;http://www.imdb.com/title/tt0077651/;http://www.guardian.co.uk/film/movie/104810/halloween;USA;HOROR\n" +
    "18;Bride of Frankenstein;James Whale;Boris Karloff, Colin Clive, Elsa Lanchester;1935;;http://www.imdb.com/title/tt0026138/;http://www.guardian.co.uk/film/movie/34577/bride-of-frankenstein;USA;HOROR\n" +
    "19;Les Diaboliques;Henri-Georges Clouzot;Paul Meurisse, Simone Signoret, Vera Clouzot;1955;;http://www.imdb.com/title/tt0046911/;http://www.guardian.co.uk/film/movie/75862/diaboliques;France;HOROR\n" +
    "20;Audition;Miike Takashi;Eihi Shiina, Ishibashi Renji, Ishibashi Ryo, Matsuda Miyuki, Renji Ishibashi, Ryo Ishibashi, Shiina Eihi;1999;;http://www.imdb.com/title/tt0235198/;http://www.guardian.co.uk/film/movie/84815/audition;Korea;HOROR\n" +
    "20;Dracula   (1958);Terence Fisher;Christopher Lee, Melissa Stribling, Michael Gough, Peter Cushing;1958;;http://www.imdb.com/title/tt0051554/;http://www.guardian.co.uk/film/movie/36215/dracula;UK;HOROR\n" +
    "22;The Blair Witch Project;Daniel Myrick, E Sanchez;Heather Donahue, Joshua Leonard, Michael C. Williams;1999;;http://www.imdb.com/title/tt0185937/;http://www.guardian.co.uk/film/movie/79459/blair.witch.project;USA;HOROR\n" +
    "23;Evil Dead/Evil Dead II;Sam Raimi;Betsy Baker, Bruce Campbell, Ellen Sandweiss;1987;;http://www.imdb.com/title/tt0083907/;http://www.guardian.co.uk/film/movie/34582/evil-dead;USA;HOROR\n" +
    "24;Carrie;Brian De Palma;John Travolta, Piper Laurie, Sissy Spacek;1976;;http://www.imdb.com/title/tt0074285/;http://www.guardian.co.uk/film/movie/81489/carrie;USA;HOROR\n" +
    "25;Les Vampires (1915);Louis Feuillade;Edouard Mathe, Marcel Levesque;1915;;http://www.imdb.com/title/tt0006206/;http://www.guardian.co.uk/film/movie/117077/vampires;France;HOROR").split("\n") ;

//  console.log(JSON.stringify(datas))
    datas.forEach(function(r) {
     
      var row = r.split(';')
      var obj = {};
      for (var i in h) {
        obj[h[i]] = row[i];
      }
      delete obj.Entry;
      obj.actors = obj.actors.split(',').map(function(l){
        return l.trim();
      })
      //console.log(JSON.stringify(obj))
      DB.collection('movies').insertOne(obj) ;
    
    })
 
// process.exit() ;
  
});
