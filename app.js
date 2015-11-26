document.addEventListener('DOMContentLoaded', function() {
  db.model.foo = 'bar';

  db.onClick('button', function() {
    console.log('here');
  });
});
