// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.
  if (page.id === 'menuPage' || page.id === 'pendingTasksPage') {
    if (document.querySelector('#menuPage')
      && document.querySelector('#pendingTasksPage')
      && !document.querySelector('#pendingTasksPage ons-list-item')
    ) {
      /*myApp.services.tasks.create({
        title: 'Bienvenue',
        category: '',
        description: 'Une appli de to-do liste.',
        urgent: true
      });*/
      /*for (var i=0; i<localStorage.length; i++) {
        myApp.services.tasks.create(localStorage.getItem(localStorage.key(i)));
      }*/
      //Object.keys(window.localStorage).forEach(function(key){
        //console.log(key);
        //myApp.services.tasks.create(window.localStorage.getItem(key));
      //});
    }
  }
});
