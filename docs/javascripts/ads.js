var content = document.querySelector(".md-content");
var insertBefore = document.querySelector(".md-content > .md-content__inner");

/**
 * Codefund
 */
var codefundAd = document.createElement("div");
codefundAd.id = "codefund_ad";
codefundAd.setAttribute("data-behavior", "sticky");
content.insertBefore(codefundAd, insertBefore);

var embedScript = document.createElement('script');
embedScript.type = 'text/javascript';
embedScript.src = "https://codefund.io/properties/b7284271-5f29-43a7-8e6e-cd68f0769509/funder.js";
document.getElementsByTagName('head')[0].appendChild(embedScript);

/**
 * Patreon
 */
var patreonAd = '<center>' +
    '<p><em>Colyseus is fully open-source. Please consider <a href="https://www.patreon.com/endel">donating any amount to support the project</a></em> ❤️</p>' +
        '<a href="https://patreon.com/endel" title="Support Colyseus on Patreon">' +
        '<img src="https://img.shields.io/badge/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.herokuapp.com%2Fendel%2Fpatrons&style=for-the-badge&label=donations" alt="Support Colyseus on Patreon"/>' +
    '</a>' +
'</center>';

var patreonAdBottom = document.createElement("div");
patreonAdBottom.id = "patreon_ad_bottom";
patreonAdBottom.innerHTML = '<hr/>' + patreonAd;
content.querySelector('article').append(patreonAdBottom);

/**
 * Top ads
 */
var topAds = document.createElement("div");
topAds.className = "top-ads";
topAds.innerHTML = patreonAd;
content.querySelector('article').prepend(topAds);