var content = document.querySelector(".md-content");
var insertBefore = document.querySelector(".md-content > .md-content__inner");

var codefundAd = document.createElement("div");
codefundAd.id = "codefund_ad";
content.insertBefore(codefundAd, insertBefore);

var embedScript = document.createElement('script');
embedScript.type = 'text/javascript';
embedScript.src = "https://codefund.io/scripts/b7284271-5f29-43a7-8e6e-cd68f0769509/embed.js";
document.getElementsByTagName('head')[0].appendChild(embedScript);