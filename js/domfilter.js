//domfilter.js

const http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const Logger = require('./log');
const logger = new Logger('js/domfilter.js');

class Domfilter {

    
    constructor(port) {
        this.server = http.createServer(requestHandler);
        this.server.listen(port, 'localhost');
    }

    stop() {
        this.server.close();
    }
}


function requestHandler(request, response)  {  
    logger.log('url = ' + request.url);
    if (request.url.startsWith('/translate/')) {
        const phrase = request.url.substring(11);
        loadAndTrim('http://www.spanishdict.com/translate/' + phrase, response);
      
    } else if (request.url.startsWith('/conjugate/')) {
        const phrase = request.url.substring(11);
        loadAndTrim('http://www.spanishdict.com/conjugate/' + phrase, response);

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
    logger.log(container);
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
                    const cardContainer = dom.window.document.getElementsByClassName('card')[0];

                    removeChildren(body, ['content-container']);
                    removeChildren(contentContainer, ['main-container']);
                    removeChildren(mainContainer, ['translate', 'conjugation']);

                    if (translateContainer) {
                        removeChildren(translateContainer, ['card', ['tab-content']]) ;
                    }
                
                    const navElements = dom.window.document.getElementsByClassName('nav-content');
                    if (navElements) {
                        const l = navElements.length;
                        for (var i = 0; i < l; i++) {
                            const parent = navElements[i].parentElement;
                            parent.removeChild(navElements[i]);
                        }
                    }
                    
                    //cardContainer.removeChild(navElement);
                    

                    response.end(dom.serialize());
                }).catch((e)=> {
                    logger.log(e.message);
                    logger.log(url);
                    logger.printStackTrace(e);
                }); 
}     

module.exports = Domfilter;


















