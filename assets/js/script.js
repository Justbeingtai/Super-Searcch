//Grabbing all of the elements to append Hero details
const heroHeaderEl = $('#hero-header');
const heroBioEl = $('#hero-bio');
const heroImgEl = $('#hero-img');
const heroComicEl = $('#hero-comic');

//Grabbing the modal <div>
const wikiListEl = $('#wiki-list');

// Grabbing the previous hero list <div> and buttons 
const prevHeroListEl = $('#prev-hero');
const heroButtonEl = $('#hero-button');

// Grabbing search bar and its input
const submitEl = $('#go');
const searchInputEl = $('#search-input');


// Setting maximum lengths for API Searches

const maxWikiLength = 5;
const maxComicLength = 5;
const maxHeroLength = 4;

// API Keys for Marvel API fetch
const publicAPIKey = '7f8b25cc4998b208788b8ed0ee3ecfc3';
const privateAPIKey = '47c3654c3694747e67461f8b148541ee58a6ba73';

function createWikiCard(wiki) {

   
    // Creating list element
    const wikiList = $('<ul>');
    
    // Referencing MediaWiki API to grab relevant data
    const wikiTitles = wiki[1];
    const wikiDescrip = wiki[2];
    const wikiLinks = wiki[3];

    // If search results are greater than maxWikiLength, shortens all arrays
    if (wikiTitles.length > maxWikiLength) {
        wikiTitles = wikiTitles.splice(maxWikiLength);
        wikiDescrip = wikiDescrip.splice(maxWikiLength);
        wikiLinks = wikiLinks.splice(maxWikiLength);
    }

    // Loops through to create list elements for each result
    for (i = 0; i < maxWikiLength; i++) {
        let title = wikiTitles[i];
        let descrip = wikiDescrip[i];
        let link = wikiLinks[i];

        
        const wikiWrapper = $('<ul>')
            .addClass('card-content')
            .append($('<li>').text(title))
            .append($('<li>').text(descrip))
            .append($('<a>').attr('href', link).text(link));

        wikiList.append(wikiWrapper);
    }

    // Appends to page
    wikiListEl.append(wikiList);

}

// Calls to Marvel API to find specific hero and append data to page
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

            // Sets all data to Local Storage.
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




// Empties all values 
function emptyValues() {
    heroHeaderEl.text('');
    heroBioEl.text('');
    heroImgEl.empty();
    heroComicEl.empty();
    wikiListEl.empty();

}

// Function to handle searching for Marvel Hero
function handleSearch(event) {

    event.preventDefault();
    if (heroBioEl.text !== '') {
        emptyValues();
    }

    searchMarvelHero(searchInputEl.val());
    searchInputEl.val('');


}

// Function to handle search upon click of a previous search button
function handlePrevSearch(event) {
    event.preventDefault();

    const heroName = $(this).attr('data-name');


    if (heroBioEl.text !== '') {
        emptyValues();
    }

    searchMarvelHero(heroName);
    searchInputEl.val('');

}

// Function to create previous search buttons
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

// function to handle fetch to MediaWiki
function wikiSearch(event) {
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
    Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });
    fetch(url)
        .then(response => { return response.json(); })
        .then(wiki => {
            console.log(wiki);
            createWikiCard(wiki);
            return;
        })


}

// function to handle opening modal and searching wiki
function handleWikiSearch(event) {
    event.preventDefault();
    wikiListEl.empty();

    wikiSearch(event);

    $('#modal').dialog({
        modal: true
    });

    return;
}

// when page is loaded, create event listeners
$(document).ready(function () {
    submitEl.click(handleSearch);

    prevHeroListEl.on('click', '.hero-button', handlePrevSearch);

    $('#wiki-div').on('click', '.wiki-btn', handleWikiSearch);
});