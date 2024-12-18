var content = document.querySelector(".md-content");
var insertBefore = document.querySelector(".md-content > .md-content__inner");

/**
 * EthicalAd
 */
var ethicalAdContainer = document.createElement("div");
ethicalAdContainer.id = "ethical_ad";

var ethicalAd = document.createElement("div");
ethicalAd.classList.add("horizontal");
ethicalAd.classList.add("raised");
ethicalAd.setAttribute("data-ea-publisher", "colyseus");
ethicalAd.setAttribute("data-ea-type", "image");
// ethicalAd.setAttribute("data-ea-type", "text");
ethicalAdContainer.appendChild(ethicalAd);

content.insertBefore(ethicalAdContainer, insertBefore);

var embedScript = document.createElement('script');
embedScript.type = 'text/javascript';
embedScript.src = "https://media.ethicalads.io/media/client/ethicalads.min.js";
document.getElementsByTagName('head')[0].appendChild(embedScript);

/**
 * Patreon
 */
var patreonAd = '<center>' +
    '<p><em>Colyseus is fully open-source. Please consider <a href="https://www.patreon.com/endel">donating any amount to support the project</a></em> ❤️</p>' +
        '<a href="https://patreon.com/endel" title="Support Colyseus on Patreon">' +
        '<img src="https://img.shields.io/badge/dynamic/json?logo=patreon&style=for-the-badge&color=%23e85b46&label=Patreon&query=data.attributes.patron_count&suffix=%20backers&url=https%3A%2F%2Fwww.patreon.com%2Fapi%2Fcampaigns%2F365642" alt="Support Colyseus on Patreon"/>' +
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
