//app.js
const favicon = require('favicon');
const nodeConsole = require('console');
const {remote, ipcRenderer,clipboard} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const http = require('http');
const {normalize} = require('path');
const {log, printStackTrace , DEBUG, INFO, WARN} = require('./js/log');
const Domfilter = require('./js/domfilter');
const appitem_style = require('./js/appitem_style');


class App {

  constructor() {
    this.domfilter = new Domfilter(3001);
  }
  
  // show "about" window
  static about() {
    const params = {toolbar: false, resizable: false, show: true, height: 150, width: 400};
    const aboutWindow = new BrowserWindow(params);

    //at the moment, about.html lives in the parent directory
    //const directory = normalize(__dirname + '/..'..........);
    //alert('file://' + directory + '/about.html');

    aboutWindow.loadURL('file://' + __dirname + '/about.html');
  }

  static translate() {
    ipcRenderer.send('show-translate-dialog', 'ping');
  }

  // change application for sidebar link
  static activate(anchor) {
    anchor = $(anchor);

    $('#sidebar li').removeClass('active');
    $('#sidebar i').removeClass('icon-white');

    anchor.closest('li').addClass('active');
    anchor.find('i').addClass('icon-white');

    App.setApp(anchor.attr('app-url'));
  }

  // set path for file explorer
  static setApp(url) {
    $('#app-container').attr('src', url);
  }

  static addApp(name, appurl) {

    favicon(appurl, (err, iconUrl)=>{

      if (err) {
        log(err);
        //TODO - give feedback
      } else {
        
        //construct listiem
        // <i> element
        const iElement = document.createElement('i');

        let propName;
        for (propName in appitem_style) {
          if (appitem_style.hasOwnProperty(propName)) {
            iElement.style[propName] = appitem_style[propName];
          }
        }
        
        iElement.style.background = 'rgba(0, 0, 0, 0) url("' + iconUrl + '") no-repeat 0px 0px)';
        iElement.style.backgroundImage = 'url("' + iconUrl + '")';
        iElement.style.backgroundOrigin = 'padding-box';
        iElement.style.backgroundPosition = '0px 0px';
        iElement.style.backgroundPositionX = '0px';
        iElement.style.backgroundPositionY = '0px';

        // <a> element
        const aElement = document.createElement('a');
        aElement.setAttribute('href', '#');
        aElement.setAttribute('app-url', appurl);
        aElement.appendChild(iElement);
        aElement.appendChild(document.createTextNode(name));


      $(aElement).on('click', function (event) {
          event.preventDefault();
          App.activate(aElement);
      });

    
        // <li> item
        const liElement = document.createElement('li');
        liElement.appendChild(aElement);

        $(liElement).insertBefore($('#applist-end'));
     }
    });
  }
}



$(document).ready(function() {
  //const d = new Domfilter(3001);
  const iframe_height = document.getElementById('app-container').offsetHeight;
  const iframe_width = document.getElementById('app-container').offsetWidth;

  $('#home-item').click((event)=>{
        event.preventDefault();
        App.activate(document.getElementById('home-item'));
  });

  App.addApp('Duolingo', 'http://www.duolingo.com/');
  App.addApp('Fluencia', 'http://www.fluencia.com');  
  

});


module.exports = App;