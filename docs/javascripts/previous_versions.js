var header = (document.querySelector('.md-header-nav__topic') || document.querySelector('.md-header__topic'));

var select = document.createElement('select');
var versions = [
  'latest',
  '0.13',
  '0.12',
  '0.11',
  '0.10',
]

var option = document.createElement('option');
option.text = "Versions";
option.value = '';
select.appendChild(option);

versions.forEach(function(version) {
  if (version === "latest") { version = "master"; }

  var option = document.createElement('option');
  option.text = version;
  option.value = 'https://' + (version.replace(/\./g, "-")) + '.docs.colyseus.io/';
  select.appendChild(option);
});

select.onchange = function() {
  if (!select.value) return;
  location.href = select.value;
}

header.appendChild(select);