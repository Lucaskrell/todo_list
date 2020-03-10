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
      var taskItem = ons.createElement(
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

      // Store data within the element.
      taskItem.data = data;

      window.localStorage.setItem(data.title, taskItem);

      taskItem.data.onCheckboxChange = function(event) {
        document.querySelector('#completed-list').appendChild(taskItem);
      };

      taskItem.addEventListener('change', taskItem.data.onCheckboxChange);

      taskItem.querySelector('.right').onclick = function() {
        myApp.services.tasks.remove(taskItem);
      };

      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      var pendingList = document.querySelector('#pending-list');
      pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
    },

    remove: function(taskItem) {
      taskItem.querySelector('.right').onclick = function(event) {
        console.log(taskItem.parentElement.id);
        if (taskItem.parentElement.id === 'corb') {
          taskItem.removeEventListener('change', taskItem.data.onCheckboxChange);
          window.localStorage.removeItem(taskItem.title);
          taskItem.remove();
        } else {
          taskItem.setAttribute('class', 'deleted-tasks');
          document.querySelector('#corb').appendChild(taskItem);
        }
      }
    },

    vidercorb: function(list) {
      if(list.children.length > 0) {
        while (list.firstChild) {
          list.removeChild(list.firstChild);
        }
      }
    }

  }
};
