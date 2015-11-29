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

  compileDom();

  function compileDom() {
    // db-bind
    var dbBindElements = document.querySelectorAll('[db-bind]');

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


    // EVENT LISTENERS
    var events = ['click', 'dbclick', 'keydown'];

    events.forEach(function(event) {
      var attributeName = 'db-' + event;
      var selector = '[' + attributeName + ']';

      var elements = document.querySelectorAll(selector);

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
});

window.addEventListener('load', function() {
  db.rerender();
});

/*

1. Wait for DOM to be available
2. Run through DOM
  2.1 Look for db-bind
    2.1.1 Add to watch list
    2.1.2 If it's an input field, event listener
  2.2 Look for db-click, db-change etc.
3. Write rerender function
4. Call rerender() when other scripts finish executing

*/
