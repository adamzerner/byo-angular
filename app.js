document.addEventListener('DOMContentLoaded', function() {
  db.model.foo = 'bar';
  db.model.sayHi = function() {
    alert('hi');
  };
});
