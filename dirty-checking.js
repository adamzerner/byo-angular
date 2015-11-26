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

  db.onClick = function(selector, cb) {
    var domElement = document.querySelector(selector);
    domElement.addEventListener('click', function() {
      cb();
      db.rerender();
    });
  };

  compileDom();

  function compileDom() {
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
  2.2 Look for db-click, db-change etc. (TODO)
3. Write rerender function
4. Call rerender() when other scripts finish executing

*/
