// requires jquery

var db = {};
db.model = {};

document.addEventListener('DOMContentLoaded', function() {
  var watchList = [];

  db.rerender = function() {
    watchList.forEach(function(watchedItem) {
      if (watchedItem.oldValue !== db.model[watchedItem.modelProperty]) {
        watchedItem.element[watchedItem.valueType] = db.model[watchedItem.modelProperty];
        watchedItem.oldValue = db.model[watchedItem.modelProperty];
      }
    });
  };

  compileDom(document);

  function compileDom(root) {
    dbBind(root);
    dbEvent(root);
    dbTemplate(root);
  }

  function dbBind(root) {
    var dbBindElements = root.querySelectorAll('[db-bind]');

    Array.prototype.forEach.call(dbBindElements, function(element) {
      var modelProperty = element.attributes.getNamedItem('db-bind').value;
      var valueType = element.nodeName === 'INPUT' ? 'value' : 'innerHTML';

      watchList.push({
        oldValue: null,
        modelProperty: modelProperty,
        element: element,
        valueType: valueType
      });

      if (element.nodeName === 'INPUT') {
        element.addEventListener('keydown', function(e) {
          setTimeout(function() {
            // using setTimeout because the updated value of the element isn't otherwise available
            db.model[modelProperty] = element[valueType];
            db.rerender();
          }, 0);
        });
      }
    });
  }

  function dbEvent(root) {
    var events = ['click', 'dbclick', 'keydown'];

    events.forEach(function(event) {
      var attributeName = 'db-' + event;
      var selector = '[' + attributeName + ']';

      var elements = root.querySelectorAll(selector);

      Array.prototype.forEach.call(elements, function(element) {
        element.addEventListener(event, function(e) {
          var cbName = element.attributes.getNamedItem(attributeName).value;
          var cb = db.model[cbName];
          cb();
          db.rerender();
        });
      });
    });
  }

  function dbTemplate(root) {
    var dbTemplateElements = root.querySelectorAll('[db-template]');
    Array.prototype.forEach.call(dbTemplateElements, function(element) {
      var templateUrl = element.attributes.getNamedItem('db-template').value;
      $.get(templateUrl, function(data) {
        $(element).html(data);
        compileDom(element);
        db.rerender();
      });
    });
  }
});

window.addEventListener('load', function() {
  db.rerender();
});
