// Grabbing all of the elements to append Hero details
const heroHeaderEl = $('#hero-header');
const heroBioEl = $('#hero-bio');
const heroImgEl = $('#hero-img');
const heroComicEl = $('#hero-comic');

// Grabbing the modal <div>
const wikiListEl = $('#wiki-list');

// Grabbing the previous hero list <div> and buttons 
const prevHeroListEl = $('#prev-hero');
const heroButtonEl = $('#hero-button');

// Grabbing search bar and its input
const submitEl = $('#go');
const searchInputEl = $('#search-input');
const resetEl = $('#reset');

// Grabbing all the boxes to hide/show
const boxes = $('.box');

// Setting maximum lengths for API Searches
const maxWikiLength = 5;
const maxComicLength = 5;
const maxHeroLength = 4;
const maxPrevSearches = 3; // Maximum number of previous searches to display

// API Keys for Marvel API fetch
const publicAPIKey = '7f8b25cc4998b208788b8ed0ee3ecfc3';
const privateAPIKey = '47c3654c3694747e67461f8b148541ee58a6ba73';

// Function to create Wiki card
function createWikiCard(wiki) {
    // Creating list element
    const wikiList = $('<ul>').attr('id', 'wiki-list');

    // Referencing MediaWiki API to grab relevant data
    let wikiTitles = wiki[1];
    let wikiDescrip = wiki[2];
    let wikiLinks = wiki[3];

    // If search results are greater than maxWikiLength, shortens all arrays
    if (wikiTitles.length > maxWikiLength) {
        wikiTitles = wikiTitles.splice(maxWikiLength);
        wikiDescrip = wikiDescrip.splice(maxWikiLength);
        wikiLinks = wikiLinks.splice(maxWikiLength);
    }

    // Loops through to create list elements for each result
    for (let i = 0; i < maxWikiLength; i++) {
        let title = wikiTitles[i];
        let descrip = wikiDescrip[i];
        let link = wikiLinks[i];

        const wikiWrapper = $('<ul>')
            .addClass('wiki-list-item card-content')
            .append($('<h3>').text(title))
            .append($('<p>').text(descrip))
            .append($('<a>').attr('href', link).text(link));

        wikiList.append(wikiWrapper);
    }

    // Appends to page
    wikiListEl.append(wikiList);
}

// Calls to Marvel API to find specific hero and append data to page
function searchMarvelHero(searchInput) {
    const timeStamp = Date.now();
    const hash = $.md5(timeStamp + privateAPIKey + publicAPIKey);

    fetch(`https://gateway.marvel.com:443/v1/public/characters?name=${searchInput}&ts=${timeStamp}&apikey=${publicAPIKey}&hash=${hash}`)
        .then(response => response.json())
        .then(data => {
            const hero = data.data.results[0];

            const heroHeader = $('<h2>').text(hero.name);
            const heroBio = $('<div>').text(hero.description);
            const heroImg = $('<img>').attr('src', `${hero.thumbnail.path}.${hero.thumbnail.extension}`);

            const heroUrls = hero.urls;
            for (let url of heroUrls) {
                if (url.type === "comiclink") {
                    let heroUrl = $('<a>').attr('href', url.url).text(url.url);
                    heroComicEl.append(heroUrl);
                }
            }

            heroHeaderEl.append(heroHeader);
            heroBioEl.append(heroBio);
            heroImgEl.append(heroImg);

            const heroStorage = {
                id: hero.id,
                name: hero.name
            };

            // Sets all data to Local Storage
            if (localStorage.getItem('hero-list') === null) {
                let heroList = [heroStorage];
                localStorage.setItem('hero-list', JSON.stringify(heroList));
                localStorage.setItem('current-hero', heroStorage.name);
            } else {
                let heroList = JSON.parse(localStorage.getItem('hero-list'));
                if (heroList.length >= maxPrevSearches) {
                    heroList.shift(); // Remove the oldest search
                }
                heroList.push(heroStorage);
                localStorage.setItem('hero-list', JSON.stringify(heroList));
                localStorage.setItem('current-hero', heroStorage.name);
                createPreviousSearchCard();
            }

            // Update hero-bio style after search
            heroBioEl.css({
                'font-size': '1.5em',
                'line-height': '1.6',
                'transition': 'all 0.5s ease'
            });

            // Show all boxes
            $('.box').removeClass('hidden');
        });
}

// Function to handle searching for Marvel Hero
function handleSearch(event) {
    event.preventDefault();
    if (heroBioEl.text() !== '') {
        emptyValues();
    }
    searchMarvelHero(searchInputEl.val());
    searchInputEl.val('');
}

// Function to reset the page
function resetPage() {
    emptyValues();
    searchInputEl.val('');
    $('.box').addClass('hidden');
}

// Function to handle search upon click of a previous search button
function handlePrevSearch(event) {
    event.preventDefault();
    const heroName = $(this).attr('data-name');
    if (heroBioEl.text() !== '') {
        emptyValues();
    }
    searchMarvelHero(heroName);
    searchInputEl.val('');
}

// Function to create previous search buttons
function createPreviousSearchCard() {
    prevHeroListEl.empty();
    let heroList = JSON.parse(localStorage.getItem('hero-list')).slice(-maxPrevSearches); // Only get the last 3 searches
    let heroListEl = $('<ul>');
    for (let hero of heroList) {
        let heroButton = $('<button>')
            .text(hero.name)
            .addClass('hero-button')
            .attr('data-name', hero.name);
        heroListEl.append($('<li>').append(heroButton));
    }
    prevHeroListEl.append(heroListEl);
}

// Function to handle fetch to MediaWiki
function wikiSearch(event) {
    event.preventDefault();
    let hero = localStorage.getItem('current-hero');
    let url = 'https://en.wikipedia.org/w/api.php';
    const params = {
        action: 'opensearch',
        search: hero + ' marvel',
        limit: maxWikiLength,
        namespace: '0',
        format: 'json'
    };
    url = url + "?origin=*";
    Object.keys(params).forEach(key => {
        url += "&" + key + "=" + params[key];
    });
    fetch(url)
        .then(response => response.json())
        .then(wiki => {
            createWikiCard(wiki);
        });
}

// Function to handle opening modal and searching wiki
function handleWikiSearch(event) {
    event.preventDefault();
    wikiListEl.empty();
    wikiSearch(event);
    $('#modal').dialog({
        modal: true
    });
}

// Function to empty all values
function emptyValues() {
    heroHeaderEl.text('');
    heroBioEl.text('');
    heroImgEl.empty();
    heroComicEl.empty();
    wikiListEl.empty();
}

// When page is loaded, create event listeners
$(document).ready(function () {
    // Initially hide all boxes
    $('.box').addClass('hidden');

    submitEl.click(handleSearch);
    resetEl.click(resetPage);
    prevHeroListEl.on('click', '.hero-button', handlePrevSearch);
    $('#wiki-div').on('click', '.wiki-btn', handleWikiSearch);
});
