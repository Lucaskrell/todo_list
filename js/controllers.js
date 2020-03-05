/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Tabbar Page Controller //
  //////////////////////////
  tabbarPage: function(page) {
    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function() {
      document.querySelector('#mySplitter').left.toggle();
    };

    // Set button functionality to push 'new_task.html' page.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/new_task.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });

    // Array.prototype.forEach.call(page.querySelectorAll('[component="button/vider-corb"]'), function(element) {
    //   element.onclick = function() {
    //     // if (element.parentElement.id === 'corb') {
    //     //   console.log('da');
    //     // }
    //     console.log('da');
    //   };
    // });
  },

  ////////////////////////////
  // New Task Page Controller //
  ////////////////////////////
  newTaskPage: function(page) {
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element) {
      element.onclick = function() {
          let titre = page.querySelector('#title-input').value;
          if (titre) {
            myApp.services.tasks.create(
              {
                title: titre,
                category: page.querySelector('#category-input').value,
                description: page.querySelector('#description-input').value,
                urgent: page.querySelector('#urgent-input').checked
              }
            );
            document.querySelector('#myNavigator').popPage();
          } else {
            ons.notification.alert('La tâche entrée n\'a pas de nom.');
          }
      }
    });
  },
};
