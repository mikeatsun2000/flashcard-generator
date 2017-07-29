//app.js
const favicon = require('favicon');
const nodeConsole = require('console');
const {remote, ipcRenderer,clipboard} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const {normalize} = require('path');
const Logger = require('./js/log');
const logger = new Logger();
const Domfilter = require('./js/domfilter');
const Database =  require('./js/db');


let domfilter = new Domfilter(3001);
let db = new Database(__dirname + '/db/')

//const logger = require('electron').remote.getGlobal('logger');


let activeApp = 'home';
let activeUrl = 'home.html';

App =  {

  activeApp: 'home',
  activeUrl: 'home.html',

  // show "about" window
  about: function() {
    const params = {toolbar: false, resizable: false, show: true, height: 150, width: 400};
    const aboutWindow = new BrowserWindow(params);

    //at the moment, about.html lives in the parent directory
    //const directory = normalize(__dirname + '/..'..........);
    //alert('file://' + directory + '/about.html');

    aboutWindow.loadURL('file://' + __dirname + '/about.html');
  },

  translate: function(params) {
    ipcRenderer.send('show-translate-dialog', 'ping');
  },

  // change application for sidebar link
  activate: function(anchor) {
    anchor = $(anchor);

    $('#sidebar li').removeClass('active');
    $('#sidebar i').removeClass('icon-white');

    anchor.closest('li').addClass('active');
    anchor.find('i').addClass('icon-white');

    this.setApp(anchor.attr('name'), anchor.attr('app-url'));
  },

  
  setApp: function(name, url) {    
    if (this.activeApp != name) {
      this.activeApp = name;
      this.activeUrl = url;
      $('#app-view').attr('src', url);
    }

    $('#app-view').removeClass('hide' );3
    $('#dict-view').addClass('hide');
    $('#button-bar').hide();
    
  },

  addAppItem: function() {
    ipcRenderer.send('show-addedit-dialog');
  },

  addEbookItem() {
    ipcRenderer.send('show-addedit-dialog', {'eBook': true  });
  },

  editAppItem:  function(name, url) {
    const id = 'id-' + name.replace(/ /g, '-');
    logger.log('in App.editApp id=' + id);
    ipcRenderer.send('show-addedit-dialog', {'id': id,'name': name, 'url': url});
  }, 

  addApp: function(args, disableEdit) {
    
    const name = args['name'];
    const appUrl = args['url'];
    logger.log('name=' + name + ' url=' +appUrl);
    logger.log('disableEdit=' + disableEdit);

    

    favicon(appUrl, (err, iconUrl)=>{
      logger.log('addApp')
      if (err) {
        logger.log(err.message);
      } else {
        logger.log('else case')
        //construct listiem
        // <i> element
        const iElement = document.createElement('i');      
        iElement.style.background = 'rgba(0, 0, 0, 0) url("' + iconUrl + '") no-repeat 0px 0px)';
        iElement.style.backgroundImage = 'url("' + iconUrl + '")';
        iElement.style.backgroundOrigin = 'padding-box';
        iElement.style.backgroundPosition = '0px 0px';
        iElement.style.backgroundPositionX = '0px';
        iElement.style.backgroundPositionY = '0px';

        iElement.style.display = 'inline-block';
        iElement.style.width = '18px';
        iElement.style.height = '18px';
        iElement.style.lineHeight = '18px';

        // <a> element
        const aElement = document.createElement('a');
        aElement.setAttribute('href', '#');
        aElement.setAttribute('app-url', appUrl);
        aElement.setAttribute('name', name);
        aElement.appendChild(iElement);
        aElement.appendChild(document.createTextNode(' ' + name)); 

        $(aElement).on('click', function (event) {
          event.preventDefault();
          App.activate(aElement);
        });

    
        // <li> item
        const liElement = document.createElement('li');
        liElement.setAttribute('id', 'id-' + name.replace(/ /g, "-"));
        if (!disableEdit) {
          liElement.className = "context-menu-editapp";
        } else {
          liElement.className = "context-menu-editapp context-menu-edit-hidden"
        }
        liElement.appendChild(aElement);

        let typ;
        if (disableEdit) {
          typ = 'ebook';
        } else {
          typ = 'app';
        }

        db.addApp(name, appUrl, $(liElement).html(), typ, (err, doc)=> { 
            if (err) {
              logger.log(err.message);
            } else {
              $(liElement).insertBefore($('#applist-end'));
            }
        });
      };
    });
  },

  loadApps: function() {
    db.loadApps((err, docs)=> {
      docs.forEach(
        (doc) => {
            const liItem = $('<li></li>')
               .addClass('context-menu-editapp')
               .attr('id', 'id-' + doc['name'])
               .html(doc['html']);

               if (doc['type'] === 'ebook') {
                  liItem.addClass('context-menu-edit-hidden');
               }
               

               const aElement = $(":first-child", liItem);
               aElement.on('click', (event) => {
                  event.preventDefault();
                   App.activate(aElement.get(0));
                });

               liItem.insertBefore($('#applist-end'));

        });
    });
  },

  editApp: function(args) {
  
    const element = $('#' + args['id']);
    const clonedElement = element.clone(true);
    clonedElement.attr('id', 'id-' + args['name'].replace(/ /g, "-"))
  
    const anchorElement = $(":first-child", clonedElement);
    anchorElement.attr('name' , args['name']).
                  attr('app-url', args['url']);
  
    anchorElement[0].childNodes[1].textContent =  args['name'];

    db.editApp(element.attr('name'), 
               args['name'], 
               args['url'], 
               clonedElement.html(),
               (err, numAffected, affectedDocuments, upsert) => {
                  if (!err) {
                     element.replaceWith(clonedElement);
                  } else {
                    logger.log(err.message);
                  }
               });
  },


  deleteAppItem: function(element) {
    db.deleteApp(element.firstChild.getAttribute('name') , (err, numRemoved) => {
        logger.log('name=' + element.firstChild.getAttribute("name"));
        logger.log('err=' + err);
        logger.log('numRemoved' + numRemoved);
        if (err) {
          logger.log(err.message);
        } else if (numRemoved > 0) {
           element.parentNode.removeChild(element);
        }
    });
   
  }
}




module.exports = App;  $('#app-url').val(targetUrl);