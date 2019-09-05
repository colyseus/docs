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

/**
 * Patreon
 */
var patreonAd = '<center>' +
    '<p>Colyseus is fully open-source. Consider donating any amount to support the project ❤️</p>' +
        '<a href="https://patreon.com/endel" title="Support Colyseus on Patreon">' +
        '<img src="https://img.shields.io/badge/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.herokuapp.com%2Fendel%2Fpatrons&style=for-the-badge&label=donations" alt="Support Colyseus on Patreon"/>' +
    '</a>' +
'</center>';

var patreonAdBottom = document.createElement("div");
patreonAdBottom.id = "patreon_ad_bottom";
patreonAdBottom.innerHTML = '<hr/>' + patreonAd;
content.querySelector('article').append(patreonAdBottom);

// var patreonAdTop = document.createElement("div");
// patreonAdTop.id = "patreon_ad_top";
// patreonAdTop.innerHTML = patreonAd + '<hr/>';
// content.querySelector('article').prepend(patreonAdTop);


/**
 * Craftpix
 */
var craftpixAd =
    '<a href="https://m.do.co/c/6833100c4766" target="_blank"><img src="/images/digitalocean.png" alt="Host on DigitalOcean: Get $50 for 30 days." /></a>' +
    '<a href="https://craftpix.net/categorys/2d-game-kits/?affiliate=101234" target="_blank"><img src="/images/craftpix.png" alt="Craftpix: Free and Premium Game Assets" /></a>';

var craftpixAdTop = document.createElement("div");
craftpixAdTop.className = "top-ads";
craftpixAdTop.innerHTML = craftpixAd;
content.querySelector('article').prepend(craftpixAdTop);