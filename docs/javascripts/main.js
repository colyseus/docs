// Handle code tabs
this.Tabs = (function() {
  Tabs.prototype.navTabs = null;
  Tabs.prototype.panels = null;
  function Tabs(elem) {
    this.navTabs = elem.getElementsByClassName('nav-item');
    this.panels = elem.getElementsByClassName('tab-pane');
    this.bind();
  };
  Tabs.prototype.show = function(index) {
    var activePanel, activeTab;
    for (var i = 0, l = this.navTabs.length; i < l; i++) {
      this.navTabs[i].classList.remove('active');
    }
    activeTab = this.navTabs[index];
    activeTab.classList.add('active');
    for (var i = 0, l = this.panels.length; i < l; i++) {
      this.panels[i].classList.remove('active');
    }
    activePanel = this.panels[index];
    return activePanel.classList.add('active');
  };
  Tabs.prototype.bind = function() {
    var _this = this;
    for (var i = 0, l = this.navTabs.length; i < l; i++) {
      (function(elem, index) {
        elem.addEventListener('click', function(evt) {
          evt.preventDefault();
          return _this.show(index);
        });
      })(this.navTabs[i], i);
    }
  };
  return Tabs;
})();

document.addEventListener('DOMContentLoaded', function() {
  var nodes = document.getElementsByClassName('code-nav-container');
  for (var i = 0, l = nodes.length; i < l; i++) {
    new Tabs(nodes[i]);
  }
});