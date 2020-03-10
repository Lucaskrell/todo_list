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
  },


  menuPage: function(page) {
  // Set functionality for 'No Category' and 'All' default categories respectively.
  myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item[category-id=""]'));
  myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item:not([category-id])'));

  // Change splitter animation depending on platform.
  document.querySelector('#mySplitter').left.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');
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
            document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
          document.querySelector('#default-category-list ons-list-item').updateCategoryView();
            document.querySelector('#myNavigator').popPage();
          } else {
            ons.notification.alert('La tâche entrée n\'a pas de nom.');
          }
      }
    });
  },

  ////////////////////////////
  // Corbeille Page Controller //
  ////////////////////////////
  corbeille: function(page) {
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/vider-corb"]'), function(element) {
      element.onclick = function() {
        let list = page.querySelector('[component="list/tasks-corbeille"]');
        if(list.children.length > 0) {
          myApp.services.tasks.vidercorb(list);
        }
      };
    });
  }

};
