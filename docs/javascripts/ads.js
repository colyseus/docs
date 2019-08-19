var content = document.querySelector(".md-content");
var insertBefore = document.querySelector(".md-content > .md-content__inner");

/**
 * Codefund
 */
var codefundAd = document.createElement("div");
codefundAd.id = "codefund_ad";
content.insertBefore(codefundAd, insertBefore);

var embedScript = document.createElement('script');
embedScript.type = 'text/javascript';
embedScript.src = "https://codefund.io/scripts/b7284271-5f29-43a7-8e6e-cd68f0769509/embed.js";
document.getElementsByTagName('head')[0].appendChild(embedScript);

var patreonAd = '<center>' +
    '<p>Colyseus is fully open-source. Consider donating any amount to support the project ❤️</p>' +
        '<a href="https://patreon.com/endel" title="Support Colyseus on Patreon">' +
        '<img src="https://img.shields.io/badge/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.herokuapp.com%2Fendel%2Fpatrons&style=for-the-badge&label=donations" alt="Support Colyseus on Patreon"/>' +
    '</a>' +
'</center>';

/**
 * Patreon
 */
var patreonAdBottom = document.createElement("div");
patreonAdBottom.id = "patreon_ad_bottom";
patreonAdBottom.innerHTML = '<hr/>' + patreonAd;
content.querySelector('article').append(patreonAdBottom);

var patreonAdTop = document.createElement("div");
patreonAdTop.id = "patreon_ad_top";
patreonAdTop.innerHTML = patreonAd + '<hr/>';
content.querySelector('article').prepend(patreonAdTop);