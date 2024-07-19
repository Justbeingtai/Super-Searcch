const heroHeaderEl = $('#hero-header');
const heroBioEl = $('#hero-bio');
const heroImgEl = $('#hero-img');
const heroComicEl = $('#hero-comic');
const wikiListEl = $('#wiki-list');
const submitEl = $('#go');
const searchInputEl = $('#search-input');

const prevHeroListEl = $('#prev-hero');
const heroButtonEl = $('#hero-button');



const maxWikiLength = 5;
const maxComicLength = 5;
const maxHeroLength = 4;
const publicAPIKey = '7f8b25cc4998b208788b8ed0ee3ecfc3';
const privateAPIKey = '47c3654c3694747e67461f8b148541ee58a6ba73';

function createWikiCard(wiki) {



    const wikiList = $('<ul>');

    const wikiTitles = wiki[1];
    const wikiDescrip = wiki[2];
    const wikiLinks = wiki[3];


    if (wikiTitles.length > maxWikiLength) {
        wikiTitles.splice(maxWikiLength);
        wikiDescrip.splice(maxWikiLength);
        wikiLinks.splice(maxWikiLength);
    }

    for (i = 0; i < maxWikiLength; i++) {
        let title = wikiTitles[i];
        let descrip = wikiDescrip[i];
        let link = wikiLinks[i];

        wikiListEl.empty();
        const wikiWrapper = $('<ul>')
            .addClass('card-content')
            .append($('<li>').text(title))
            .append($('<li>').text(descrip))
            .append($('<a>').attr('href', link).text(link));
            
        wikiList.append(wikiWrapper);
    }

    wikiListEl.append(wikiList);

}


function searchMarvelHero(searchInput) {



    const timeStamp = this.timeStamp;
    const hash = $.md5(timeStamp + '' + privateAPIKey + '' + publicAPIKey);



    fetch(`https://gateway.marvel.com:443/v1/public/characters?name=${searchInput}&ts=${timeStamp}&apikey=${publicAPIKey}&hash=${hash}`)
        .then(response => {

            return response.json();
        })
        .then(data => {
            hero = data.data["results"][0];



            const heroHeader = $('<h2>')
                .addClass('')
                .text(hero.name);
            const heroBio = $('<div>')
                .addClass('')
                .text(hero.description);
            const heroImg = $('<img>')
                .addClass('')
                .attr('src', hero.thumbnail["path"] + "." + hero.thumbnail["extension"]);


            const heroUrls = hero["urls"];

            for (url of heroUrls) {
                if (url.type === "comiclink") {
                    let heroUrl = $('<a>').attr('href', '' + url.url).text(url.url);
                    heroComicEl.append(heroUrl);
                    console.log(url.url);
                }
            }



            heroHeaderEl.append(heroHeader);
            heroBioEl.append(heroBio);
            heroImgEl.append(heroImg);



            const heroStorage = {
                id: hero.id,
                name: hero.name
            };

            if (localStorage.getItem('hero-list') === null) {
                let heroList = [heroStorage];
                localStorage.setItem('hero-list', JSON.stringify(heroList));
                localStorage.setItem('current-hero', heroStorage.name);

            }
            else if (JSON.parse(localStorage.getItem('hero-list')).length > maxHeroLength) {
                let heroList = JSON.parse(localStorage.getItem('hero-list'));
                heroList = heroList.splice(1);
                heroList.push(heroStorage);
                console.log(heroList);
                createPreviousSearchCard();
                localStorage.setItem('current-hero', heroStorage.name);
            }
            else {
                let heroList = JSON.parse(localStorage.getItem('hero-list'));
                heroList.push(heroStorage);
                localStorage.setItem('hero-list', JSON.stringify(heroList))
                console.log(heroList);
                createPreviousSearchCard();
                localStorage.setItem('current-hero', heroStorage.name);
            }
        }

        )

    return;
}

function createWikiCard(wiki) {

    const wikiList = $('<ul>');

    const wikiTitles = wiki[1];
    const wikiDescrip = wiki[2];
    const wikiLinks = wiki[3];
    

    if (wikiTitles.length > maxWikiLength) {
        wikiTitles.splice(maxWikiLength);
        wikiDescrip.splice(maxWikiLength);
        wikiLinks.splice(maxWikiLength);
    }

    for(i = 0; i<maxWikiLength; i++){
        let title = wikiTitles[i];
        let descrip = wikiDescrip[i];
        let link = wikiLinks[i];

        const wikiWrapper = $('<ul>')
        .append($('<li>').text(title))
        .append($('<li>').text(descrip))
        .append($('<a>').attr('href', link)
                .text(link));

        wikiList.append(wikiWrapper);
    }

    wikiListEl.append(wikiList);

}
var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    action: "opensearch",
    search: "Hampi",
    limit: "5",
    namespace: "0",
    format: "json"
};

function getApi(url){
    fetch(url).then(function(response){
        console.log(response);
    });
        
    
}


function handleSearch(event){
    event.preventDefault();
    const hero = searchMarvelHero(searchInputEl.val());
    searchInputEl.text('');
    createHeroCard(hero);

}

function toggleMode() {
    const searchBox = document.querySelector('.search-box');
    const toggleButton = document.getElementById('toggle-button');

    if (searchBox.classList.contains('hero')) {
        searchBox.classList.remove('hero');
        searchBox.classList.add('villain');
        toggleButton.textContent = 'Switch to Heroes';
    } else {
        searchBox.classList.remove('villain');
        searchBox.classList.add('hero');
        toggleButton.textContent = 'Switch to Villains';
    }

}

function emptyValues() {
    heroHeaderEl.text('');
    heroBioEl.text('');
    heroImgEl.empty();
    heroComicEl.empty();
    wikiListEl.empty();

}

function handleSearch(event) {

    event.preventDefault();
    if (heroBioEl.text !== '') {
        emptyValues();
    }

    searchMarvelHero(searchInputEl.val());
    searchInputEl.val('');


}

function handlePrevSearch(event) {
    event.preventDefault();

    const heroName = $(this).attr('data-name');


    if (heroBioEl.text !== '') {
        emptyValues();
    }

    searchMarvelHero(heroName);
    searchInputEl.val('');

}

function createPreviousSearchCard() {

    prevHeroListEl.empty();
    let heroList = JSON.parse(localStorage.getItem('hero-list'));

    let heroListEl = $('<ul>');
    for (hero of heroList) {
        let heroButton = $('<button>')
            .text(hero.name)
            .addClass('box hero-button')
            .attr('data-name', hero.name);
        heroListEl.append(heroButton);
    }

    prevHeroListEl.append(heroListEl);

}

function wikiSearch(event){
    event.preventDefault()
    let hero = localStorage.getItem('current-hero');
    console.log(hero);
    let url = 'https://en.wikipedia.org/w/api.php'
    const params = {
        action: 'opensearch',
        search: hero + ' marvel',
        limit: maxWikiLength,
        namespace: '0',
        format: 'json'
        
    };
    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
    fetch(url)
        .then(response => {return response.json();})
        .then(wiki =>{
            console.log(wiki);
            createWikiCard(wiki);
            return;
        })

   
}

function handleWikiSearch(event){
    event.preventDefault();
    
    wikiSearch(event);

    $('#modal').dialog({
        modal: true
    });
    
    return;
}

$(document).ready(function () {
    submitEl.click(handleSearch);

    prevHeroListEl.on('click', '.hero-button', handlePrevSearch);

    $('#wiki-div').on( 'click', '.wiki-btn', handleWikiSearch);
});