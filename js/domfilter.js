//domfilter.js

const http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {log, printStackTrace , DEBUG, INFO, WARN} = require('./log');

class Domfilter {

    
    constructor(port) {
        log('domfilter ctor');
        this.server = http.createServer(requestHandler);
        this.server.listen(port, 'localhost');
    }

    stop() {
        this.server.close();
    }
}

function requestHandler(request, response)  {  
    
    log('handling -- ' + request.url);
    if (request.url.startsWith('/lookup/')) {
        const phrase = request.url.substring(8);
        loadAndTrim('http://www.spanishdict.com/translate/' + phrase, response);

        /*
        
        JSDOM.fromURL('http://www.spanishdict.com/translate/' + phrase , options).then((dom) => {
                const body = dom.window.document.getElementsByTagName('body')[0]
                const contentContainer = dom.window.document.getElementsByClassName('content-container')[0];
                const mainContainer = dom.window.document.getElementsByClassName('main-container')[0];
                removeChildren(body, ['content-container']);
                removeChildren(contentContainer, ['main-container']);
                removeChildren(mainContainer, ['translate']);

                response.end(dom.serialize());
            }).catch((e)=> {
                alert(e.message);
            }); 
         */
      
    } else if  (request.url.startsWith('/examples')) {
        const phrase = request.url(substring(9));
        loadAndTrim('http://www.spanishdict.com/translate/' + phrase);
    }
}

function spliceBetween(str, toinsert, start, end) {
    const startindex = str.search(start) + start.length ;
    const endindex = str.search(end);
    //console.log(`startindex = ${startindex} endindex = ${endindex}`);

    if (startindex != -1 && endindex != -1 && startindex <= endindex) {
        return str.substring(0, startindex) + toinsert + str.substring(endindex);
    }
}

function removeChildren(container, excludedClasses) {
    const containerChildren = container.children;
    const l = containerChildren.length;
    let nodesToRemove = [];
    if (excludedClasses) {
        for (var i = 0; i < l; i++) {
            const current = containerChildren[i];
            let excluded = false;
            for (var j = 0; j < excludedClasses.length; j++) {
                if (current.classList.contains(excludedClasses[j])) {
                   excluded = true;
                } 
            }
            if (!excluded) {
                nodesToRemove.push(current);
            }
        }
    } else {
        nodesToRemove = containerChildren;
    }
    
    nodesToRemove.forEach((node)=>{
        container.removeChild(node)
    });
}


function loadAndTrim(url, response) {
    JSDOM.fromURL(url).then((dom) => {
                    const body = dom.window.document.getElementsByTagName('body')[0]
                    const contentContainer = dom.window.document.getElementsByClassName('content-container')[0];
                    const mainContainer = dom.window.document.getElementsByClassName('main-container')[0];
                    const translateContainer = dom.window.document.getElementsByClassName('translate')[0]
                    removeChildren(body, ['content-container']);
                    removeChildren(contentContainer, ['main-container']);
                    removeChildren(mainContainer, ['translate']);
                    removeChildren(translateContainer, ['card']);

                    response.end(dom.serialize());
                }).catch((e)=> {
                    log(e.message + ' --' + url);
                    printStackTrace(e);
                    alert(e.stack);
                }); 
}     

module.exports = Domfilter;


















