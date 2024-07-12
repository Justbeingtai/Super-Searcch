const heroHeaderEl = $('#hero-header');
const heroBioEl = $('#hero-bio');
const heroImgEl = $('#hero-img');
const heroComicEl = $('#hero-comic');


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


