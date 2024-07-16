const heroHeaderEl = $('#hero-header');
const heroBioEl = $('#hero-bio');
const heroImgEl = $('#hero-img');
const heroComicEl = $('#hero-comic');
const wikiListEl = $('#wiki-list');
const maxWikiLength = 5;
const publicAPIKey = '7f8b25cc4998b208788b8ed0ee3ecfc3';
const privateAPIKey = '47c3654c3694747e67461f8b148541ee58a6ba73';




function createHeroCard(hero) {



    const heroHeader = $('<div>')
        .addClass('')
        .text(hero.name);
    const heroBio = $('<div>')
        .addClass('')
        .text(hero.bio);
    const heroImg = $('<img>')
        .addClass('')
        .attr('src', hero.img);
    const heroComic = $('<ul>');

    const heroComicList = hero.comics;

    for (let comic of heroComicList) {
        comicListItem = $('<li>')
            .addClass('')
            .text(comic.title);

        heroComic.append(comicListItem);
    }

    heroHeaderEl.append(heroHeader);
    heroBioEl.append(heroBio);
    heroImgEl.append(heroImg);
    heroComicEl.append(heroComicList);

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


