// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {
  let page = event.target;

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
      if (window.localStorage.length > 0) {
        Object.keys(window.localStorage).forEach(function(key){
          //console.log(key);
          //console.log(window.localStorage.getItem(key));
          myApp.services.tasks.afficherListe(key);
        });
      }
      /*myApp.services.tasks.create({
        title: 'Bienvenue',
        category: '',
        description: 'Une appli de to-do liste.',
        urgent: true
      });*/
      /*for (var i=0; i<localStorage.length; i++) {
        myApp.services.tasks.create(localStorage.getItem(localStorage.key(i)));
      }*/
    }
  }
});
