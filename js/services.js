/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  /////////////////
  // Task Service //
  /////////////////
  tasks: {

    // Creates a new task and attaches it to the pending task list.
    create: function (data) {
      // Task item template.

      let taskItem = ons.createElement(
        //'<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
        '<ons-list-item tappable category="' + data.category + '">' +
        '<label class="left">' +
        '<ons-checkbox></ons-checkbox>' +
        '</label>' +
        '<div class="center">' +
        data.title +
        '</div>' +
        '<div class="right">' +
        '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
        '</div>' +
        '</ons-list-item>'
      );

      window.localStorage.setItem(data.title, JSON.stringify({
        title: data.title,
        category: data.category,
        description: data.description,
        urgent: data.urgent,
        page : 'pending-list'
      }));

      myApp.services.tasks.init(taskItem, data);
    },

    afficherListe: function(key) {
      let data = JSON.parse(window.localStorage.getItem(key));

      let taskItem = ons.createElement(
          //'<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
          '<ons-list-item tappable category="' + data.category + '">' +
          '<label class="left">' +
          '<ons-checkbox></ons-checkbox>' +
          '</label>' +
          '<div class="center">' +
          data.title +
          '</div>' +
          '<div class="right">' +
          '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
          '</div>' +
          '</ons-list-item>'
      );

      myApp.services.tasks.init(taskItem, data);
    },

    remove: function(taskItem) {
      let data = taskItem.data;
      taskItem.querySelector('.right').onclick = function() {
        if (taskItem.parentElement.id === 'corb') {
          taskItem.removeEventListener('change', taskItem.data.onCheckboxChange);
          window.localStorage.removeItem(taskItem.data.title);
          myApp.services.animators.remove(taskItem, function() {
            taskItem.remove();
            myApp.services.categories.updateRemove(taskItem.data.category);
          });
        } else {
          taskItem.setAttribute('class', 'deleted-tasks');
          document.querySelector('#corb').appendChild(taskItem);
          taskItem.data.page = 'corb';
          window.localStorage.removeItem(data.title);
          window.localStorage.setItem(data.title, JSON.stringify({
            title: data.title,
            category: data.category,
            description: data.description,
            urgent: data.urgent,
            page : 'corb'
          }));
        }
      }
    },

    vidercorb: function(list) {
      if(list.children.length > 0 && list.firstChild) {
        while (list.firstChild) {
          window.localStorage.removeItem(list.firstChild.data.title);
          list.removeChild(list.firstChild);
        }
      }
    },

    update: function(taskItem, data) {
      if (data.title !== taskItem.data.title) {
        window.localStorage.removeItem(taskItem.data.title);
        // Update title view.
        taskItem.querySelector('.center').innerHTML = data.title;
      }

      if (data.category !== taskItem.data.category) {
        // Modify the item before updating categories.
        taskItem.setAttribute('category', myApp.services.categories.parseId(data.category));
        // Check if it's necessary to create new categories.
        myApp.services.categories.updateAdd(data.category);
        // Check if it's necessary to remove empty categories.
        myApp.services.categories.updateRemove(taskItem.data.category);

      }

      // Add or remove the highlight.
      taskItem.classList[data.highlight ? 'add' : 'remove']('highlight');

      // Store the new data within the element.
      taskItem.data = data;

      window.localStorage.setItem(data.title, JSON.stringify(data));
    },

    init: function(taskItem, data) {
      // Store data within the element.
      taskItem.data = data;

      taskItem.data.onCheckboxChange = function(event) {
        myApp.services.animators.swipe(taskItem, function() {
          let listId = (taskItem.parentElement.id === 'pending-list' && event.target.checked) ? 'completed-list' : 'pending-list';
          data.page = listId;
          window.localStorage.removeItem(data.title);
          window.localStorage.setItem(data.title, JSON.stringify(data));
          document.querySelector('#'+data.page).appendChild(taskItem);
        });
      };

      taskItem.addEventListener('change', taskItem.data.onCheckboxChange);

      taskItem.querySelector('.right').onclick = function() {
        myApp.services.tasks.remove(taskItem);
      };

      taskItem.querySelector('.center').onclick = function() {
        document.querySelector('#myNavigator')
            .pushPage('html/details_task.html',
                {
                  animation: 'lift',
                  data: {
                    element: taskItem
                  }
                }
            );
      };

      myApp.services.categories.updateAdd(taskItem.data.category);

      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      let pendingList = document.querySelector('#'+data.page);
      pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
    }

  },
  categories: {

    // Creates a new category and attaches it to the custom category list.
    create: function(categoryLabel) {
      let categoryId = myApp.services.categories.parseId(categoryLabel);

      // Category item template.
      let categoryItem = ons.createElement(
        '<ons-list-item tappable category-id="' + categoryId + '">' +
          '<div class="left">' +
            '<ons-radio name="categoryGroup" input-id="radio-'  + categoryId + '"></ons-radio>' +
          '</div>' +
          '<label class="center" for="radio-' + categoryId + '">' +
            (categoryLabel || 'No category') +
          '</label>' +
        '</ons-list-item>'
      );

      // Adds filtering functionality to this category item.
      myApp.services.categories.bindOnCheckboxChange(categoryItem);

      // Attach the new category to the corresponding list.
      document.querySelector('#custom-category-list').appendChild(categoryItem);
    },

    // On task creation/update, updates the category list adding new categories if needed.
    updateAdd: function(categoryLabel) {
      let categoryId = myApp.services.categories.parseId(categoryLabel);
      let categoryItem = document.querySelector('#menuPage ons-list-item[category-id="' + categoryId + '"]');

      if (!categoryItem) {
        // If the category doesn't exist already, create it.
        myApp.services.categories.create(categoryLabel);
      }
    },

    // On task deletion/update, updates the category list removing categories without tasks if needed.
    updateRemove: function(categoryLabel) {
      let categoryId = myApp.services.categories.parseId(categoryLabel);
      let categoryItem = document.querySelector('#tabbarPage ons-list-item[category="' + categoryId + '"]');

      if (!categoryItem) {
        // If there are no tasks under this category, remove it.
        myApp.services.categories.remove(document.querySelector('#custom-category-list ons-list-item[category-id="' + categoryId + '"]'));
      }
    },

    // Deletes a category item and its listeners.
    remove: function(categoryItem) {
      if (categoryItem) {
        // Remove listeners and the item itself.
        categoryItem.removeEventListener('change', categoryItem.updateCategoryView);
        categoryItem.remove();
      }
    },

    // Adds filtering functionality to a category item.
    bindOnCheckboxChange: function(categoryItem) {
      let categoryId = categoryItem.getAttribute('category-id');
      let allItems = categoryId === null;

      categoryItem.updateCategoryView = function() {
        let query = '[category="' + (categoryId || '') + '"]';

        let taskItems = document.querySelectorAll('#tabbarPage ons-list-item');
        for (let i = 0; i < taskItems.length; i++) {
          taskItems[i].style.display = (allItems || taskItems[i].getAttribute('category') === categoryId) ? '' : 'none';
        }
      };

      categoryItem.addEventListener('change', categoryItem.updateCategoryView);
    },

    // Transforms a category name into a valid id.
    parseId: function(categoryLabel) {
      return categoryLabel ? categoryLabel.replace(/\s\s+/g, ' ').toLowerCase() : '';
    }
  },

  //////////////////////
  // Animation Service //
  /////////////////////
  animators: {

    // Swipe animation for task completion.
    swipe: function(listItem, callback) {
      let animation = (listItem.parentElement.id === 'pending-list') ? 'animation-swipe-right' : 'animation-swipe-left';
      listItem.classList.add('hide-children');
      listItem.classList.add(animation);

      setTimeout(function() {
        listItem.classList.remove(animation);
        listItem.classList.remove('hide-children');
        callback();
      }, 950);
    },

    // Remove animation for task deletion.
    remove: function(listItem, callback) {
      listItem.classList.add('animation-remove');
      listItem.classList.add('hide-children');

      setTimeout(function() {
        callback();
      }, 750);
    }
  },

};
