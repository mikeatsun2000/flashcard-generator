//app.js
const favicon = require('favicon');
const nodeConsole = require('console');

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const http = require('http');
const {normalize} = require('path');


const {log, printStackTrace , DEBUG, INFO, WARN} = require('./js/log');
const Domfilter = require('./js/domfilter');

const appitem_style = require('./js/appitem_style');


class App {

  constructor() {
  
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
  const d = new Domfilter(3001);
  const iframe_height = document.getElementById('app-container').offsetHeight;
  const iframe_width = document.getElementById('app-container').offsetWidth;

  $('#home-item').click((event)=>{
        event.preventDefault();
        App.activate(document.getElementById('home-item'));
  });

  //App.addApp('Duolingo', 'http://www.duolingo.com/');
  App.addApp('Fluencia', 'http://www.fluencia.com');  
  

});


/*
const appitem_style = {/*
  '0': 'animation-delay',
  '1': 'animation-direction',
  '2': 'animation-duration',
  '3': 'animation-fill-mode',
  '4': 'animation-iteration-count',
  '5': 'animation-name',
  '6': 'animation-play-state',
  '7': 'animation-timing-function',
  '8': 'background-attachment',
  '9': 'background-blend-mode',
  '10': 'background-clip',
  '11': 'background-color',
  '12': 'background-image',
  '13': 'background-origin',
  '14': 'background-position',
  '15': 'background-repeat',
  '16': 'background-size',
  '17': 'border-bottom-color',
  '18': 'border-bottom-left-radius',
  '19': 'border-bottom-right-radius',
  '20': 'border-bottom-style',
  '21': 'border-bottom-width',
  '22': 'border-collapse',
  '23': 'border-image-outset',
  '24': 'border-image-repeat',
  '25': 'border-image-slice',
  '26': 'border-image-source',
  '27': 'border-image-width',
  '28': 'border-left-color',
  '29': 'border-left-style',
  '30': 'border-left-width',
  '31': 'border-right-color',
  '32': 'border-right-style',
  '33': 'border-right-width',
  '34': 'border-top-color',
  '35': 'border-top-left-radius',
  '36': 'border-top-right-radius',
  '37': 'border-top-style',
  '38': 'border-top-width',
  '39': 'bottom',
  '40': 'box-shadow',
  '41': 'box-sizing',
  '42': 'break-after',
  '43': 'break-before',
  '44': 'break-inside',
  '45': 'caption-side',
  '46': 'clear',
  '47': 'clip',
  '48': 'color',
  '49': 'content',
  '50': 'cursor',
  '51': 'direction',
  '52': 'display',
  '53': 'empty-cells',
  '54': 'float',
  '55': 'font-family',
  '56': 'font-kerning',
  '57': 'font-size',
  '58': 'font-stretch',
  '59': 'font-style',
  '60': 'font-variant',
  '61': 'font-variant-ligatures',
  '62': 'font-variant-caps',
  '63': 'font-variant-numeric',
  '64': 'font-weight',
  '65': 'height',
  '66': 'image-rendering',
  '67': 'isolation',
  '68': 'left',
  '69': 'letter-spacing',
  '70': 'line-height',
  '71': 'list-style-image',
  '72': 'list-style-position',
  '73': 'list-style-type',
  '74': 'margin-bottom',
  '75': 'margin-left',
  '76': 'margin-right',
  '77': 'margin-top',
  '78': 'max-height',
  '79': 'max-width',
  '80': 'min-height',
  '81': 'min-width',
  '82': 'mix-blend-mode',
  '83': 'object-fit',
  '84': 'object-position',
  '85': 'offset-distance',
  '86': 'offset-path',
  '87': 'offset-rotate',
  '88': 'offset-rotation',
  '89': 'opacity',
  '90': 'orphans',
  '91': 'outline-color',
  '92': 'outline-offset',
  '93': 'outline-style',
  '94': 'outline-width',
  '95': 'overflow-anchor',
  '96': 'overflow-wrap',
  '97': 'overflow-x',
  '98': 'overflow-y',
  '99': 'padding-bottom',
  '100': 'padding-left',
  '101': 'padding-right',
  '102': 'padding-top',
  '103': 'pointer-events',
  '104': 'position',
  '105': 'resize',
  '106': 'right',
  '107': 'speak',
  '108': 'table-layout',
  '109': 'tab-size',
  '110': 'text-align',
  '111': 'text-align-last',
  '112': 'text-decoration',
  '113': 'text-indent',
  '114': 'text-rendering',
  '115': 'text-shadow',
  '116': 'text-size-adjust',
  '117': 'text-overflow',
  '118': 'text-transform',
  '119': 'top',
  '120': 'touch-action',
  '121': 'transition-delay',
  '122': 'transition-duration',
  '123': 'transition-property',
  '124': 'transition-timing-function',
  '125': 'unicode-bidi',
  '126': 'vertical-align',
  '127': 'visibility',
  '128': 'white-space',
  '129': 'widows',
  '130': 'width',
  '131': 'will-change',
  '132': 'word-break',
  '133': 'word-spacing',
  '134': 'word-wrap',
  '135': 'z-index',
  '136': 'zoom',
  '137': '-webkit-appearance',
  '138': 'backface-visibility',
  '139': '-webkit-background-clip',
  '140': '-webkit-background-origin',
  '141': '-webkit-border-horizontal-spacing',
  '142': '-webkit-border-image',
  '143': '-webkit-border-vertical-spacing',
  '144': '-webkit-box-align',
  '145': '-webkit-box-decoration-break',
  '146': '-webkit-box-direction',
  '147': '-webkit-box-flex',
  '148': '-webkit-box-flex-group',
  '149': '-webkit-box-lines',
  '150': '-webkit-box-ordinal-group',
  '151': '-webkit-box-orient',
  '152': '-webkit-box-pack',
  '153': '-webkit-box-reflect',
  '154': 'column-count',
  '155': 'column-gap',
  '156': 'column-rule-color',
  '157': 'column-rule-style',
  '158': 'column-rule-width',
  '159': 'column-span',
  '160': 'column-width',
  '161': 'align-content',
  '162': 'align-items',
  '163': 'align-self',
  '164': 'flex-basis',
  '165': 'flex-grow',
  '166': 'flex-shrink',
  '167': 'flex-direction',
  '168': 'flex-wrap',
  '169': 'justify-content',
  '170': '-webkit-font-smoothing',
  '171': '-webkit-highlight',
  '172': 'hyphens',
  '173': '-webkit-hyphenate-character',
  '174': '-webkit-line-break',
  '175': '-webkit-line-clamp',
  '176': '-webkit-locale',
  '177': '-webkit-margin-before-collapse',
  '178': '-webkit-margin-after-collapse',
  '179': '-webkit-mask-box-image',
  '180': '-webkit-mask-box-image-outset',
  '181': '-webkit-mask-box-image-repeat',
  '182': '-webkit-mask-box-image-slice',
  '183': '-webkit-mask-box-image-source',
  '184': '-webkit-mask-box-image-width',
  '185': '-webkit-mask-clip',
  '186': '-webkit-mask-composite',
  '187': '-webkit-mask-image',
  '188': '-webkit-mask-origin',
  '189': '-webkit-mask-position',
  '190': '-webkit-mask-repeat',
  '191': '-webkit-mask-size',
  '192': 'order',
  '193': 'perspective',
  '194': 'perspective-origin',
  '195': '-webkit-print-color-adjust',
  '196': '-webkit-rtl-ordering',
  '197': 'shape-outside',
  '198': 'shape-image-threshold',
  '199': 'shape-margin',
  '200': '-webkit-tap-highlight-color',
  '201': '-webkit-text-combine',
  '202': '-webkit-text-decorations-in-effect',
  '203': '-webkit-text-emphasis-color',
  '204': '-webkit-text-emphasis-position',
  '205': '-webkit-text-emphasis-style',
  '206': '-webkit-text-fill-color',
  '207': '-webkit-text-orientation',
  '208': '-webkit-text-security',
  '209': '-webkit-text-stroke-color',
  '210': '-webkit-text-stroke-width',
  '211': 'transform',
  '212': 'transform-origin',
  '213': 'transform-style',
  '214': '-webkit-user-drag',
  '215': '-webkit-user-modify',
  '216': 'user-select',
  '217': '-webkit-writing-mode',
  '218': '-webkit-app-region',
  '219': 'buffered-rendering',
  '220': 'clip-path',
  '221': 'clip-rule',
  '222': 'mask',
  '223': 'filter',
  '224': 'flood-color',
  '225': 'flood-opacity',
  '226': 'lighting-color',
  '227': 'stop-color',
  '228': 'stop-opacity',
  '229': 'color-interpolation',
  '230': 'color-interpolation-filters',
  '231': 'color-rendering',
  '232': 'fill',
  '233': 'fill-opacity',
  '234': 'fill-rule',
  '235': 'marker-end',
  '236': 'marker-mid',
  '237': 'marker-start',
  '238': 'mask-type',
  '239': 'shape-rendering',
  '240': 'stroke',
  '241': 'stroke-dasharray',
  '242': 'stroke-dashoffset',
  '243': 'stroke-linecap',
  '244': 'stroke-linejoin',
  '245': 'stroke-miterlimit',
  '246': 'stroke-opacity',
  '247': 'stroke-width',
  '248': 'alignment-baseline',
  '249': 'baseline-shift',
  '250': 'dominant-baseline',
  '251': 'text-anchor',
  '252': 'writing-mode',
  '253': 'vector-effect',
  '254': 'paint-order',
  '255': 'd',
  '256': 'cx',
  '257': 'cy',
  '258': 'x',
  '259': 'y',
  '260': 'r',
  '261': 'rx',
  '262': 'ry',
  
  alignContent: 'stretch',
  alignItems: 'stretch',
  alignSelf: 'stretch',
  alignmentBaseline: 'auto',
  all: '',
  animation: 'none 0s ease 0s 1 normal none running',
  animationDelay: '0s',
  animationDirection: 'normal',
  animationDuration: '0s',
  animationFillMode: 'none',
  animationIterationCount: '1',
  animationName: 'none',
  animationPlayState: 'running',
  animationTimingFunction: 'ease',
  backfaceVisibility: 'visible',
  background: 'rgba(0, 0, 0, 0) url("file:///home/mike/projects/flashcard-generator/img/glyphicons-halflings-white.png") no-repeat scroll 0px -24px / auto padding-box border-box',
  backgroundAttachment: 'scroll',
  backgroundBlendMode: 'normal',
  backgroundClip: 'border-box',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  backgroundImage: 'url("file:///home/mike/projects/flashcard-generator/img/glyphicons-halflings-white.png")',
  backgroundOrigin: 'padding-box',
  backgroundPosition: '0px -24px',
  backgroundPositionX: '0px',
  backgroundPositionY: '-24px',
  backgroundRepeat: 'no-repeat',
  backgroundRepeatX: '',
  backgroundRepeatY: '',
  backgroundSize: 'auto',
  baselineShift: '0px',
  border: '0px none rgb(255, 255, 255)',
  borderBottom: '0px none rgb(255, 255, 255)',
  borderBottomColor: 'rgb(255, 255, 255)',
  borderBottomLeftRadius: '0px',
  borderBottomRightRadius: '0px',
  borderBottomStyle: 'none',
  borderBottomWidth: '0px',
  borderCollapse: 'separate',
  borderColor: 'rgb(255, 255, 255)',
  borderImage: 'none',
  borderImageOutset: '0px',
  borderImageRepeat: 'stretch',
  borderImageSlice: '100%',
  borderImageSource: 'none',
  borderImageWidth: '1',
  borderLeft: '0px none rgb(255, 255, 255)',
  borderLeftColor: 'rgb(255, 255, 255)',
  borderLeftStyle: 'none',
  borderLeftWidth: '0px',
  borderRadius: '0px',
  borderRight: '0px none rgb(255, 255, 255)',
  borderRightColor: 'rgb(255, 255, 255)',
  borderRightStyle: 'none',
  borderRightWidth: '0px',
  borderSpacing: '0px 0px',
  borderStyle: 'none',
  borderTop: '0px none rgb(255, 255, 255)',
  borderTopColor: 'rgb(255, 255, 255)',
  borderTopLeftRadius: '0px',
  borderTopRightRadius: '0px',
  borderTopStyle: 'none',
  borderTopWidth: '0px',
  borderWidth: '0px',
  bottom: 'auto',
  boxShadow: 'none',
  boxSizing: 'content-box',
  breakAfter: 'auto',
  breakBefore: 'auto',
  breakInside: 'auto',
  bufferedRendering: 'auto',
  captionSide: 'top',
  clear: 'none',
  clip: 'auto',
  clipPath: 'none',
  clipRule: 'nonzero',
  color: 'rgb(255, 255, 255)',
  colorInterpolation: 'sRGB',
  colorInterpolationFilters: 'linearRGB',
  colorRendering: 'auto',
  columnCount: 'auto',
  columnFill: 'balance',
  columnGap: 'normal',
  columnRule: '0px none rgb(255, 255, 255)',
  columnRuleColor: 'rgb(255, 255, 255)',
  columnRuleStyle: 'none',
  columnRuleWidth: '0px',
  columnSpan: 'none',
  columnWidth: 'auto',
  columns: 'auto auto',
  contain: 'none',
  content: '',
  counterIncrement: 'none',
  counterReset: 'none',
  cursor: 'auto',
  cx: '0px',
  cy: '0px',
  d: 'none',
  direction: 'ltr',
  display: 'inline-block',
  dominantBaseline: 'auto',
  emptyCells: 'show',
  fill: 'rgb(0, 0, 0)',
  fillOpacity: '1',
  fillRule: 'nonzero',
  filter: 'none',
  flex: '0 1 auto',
  flexBasis: 'auto',
  flexDirection: 'row',
  flexFlow: 'row nowrap',
  flexGrow: '0',
  flexShrink: '1',
  flexWrap: 'nowrap',
  float: 'none',
  floodColor: 'rgb(0, 0, 0)',
  floodOpacity: '1',
  font: 'italic normal normal normal 13px / 14px -apple-system, "Helvetica Neue", Helvetica, sans-serif',
  fontFamily: '-apple-system, "Helvetica Neue", Helvetica, sans-serif',
  fontFeatureSettings: 'normal',
  fontKerning: 'auto',
  fontSize: '13px',
  fontStretch: 'normal',
  fontStyle: 'italic',
  fontVariant: 'normal',
  fontVariantCaps: 'normal',
  fontVariantLigatures: 'normal',
  fontVariantNumeric: 'normal',
  fontWeight: 'normal',
  height: '14px',
  hyphens: 'manual',
  imageRendering: 'auto',
  isolation: 'auto',
  justifyContent: 'flex-start',
  left: 'auto',
  letterSpacing: 'normal',
  lightingColor: 'rgb(255, 255, 255)',
  lineHeight: '14px',
  listStyle: 'none outside none',
  listStyleImage: 'none',
  listStylePosition: 'outside',
  listStyleType: 'none',
  margin: '0px 2px 0px 0px',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '2px',
  marginTop: '0px',
  marker: '',
  markerEnd: 'none',
  markerMid: 'none',
  markerStart: 'none',
  mask: 'none',
  maskType: 'luminance',
  maxHeight: 'none',
  maxWidth: 'none',
  maxZoom: '',
  minHeight: '0px',
  minWidth: '0px',
  minZoom: '',
  mixBlendMode: 'normal',
  motion: 'none 0px auto 0deg',
  objectFit: 'fill',
  objectPosition: '50% 50%',
  offset: 'none 0px auto 0deg',
  offsetDistance: '0px',
  offsetPath: 'none',
  offsetRotate: 'auto 0deg',
  offsetRotation: 'auto 0deg',
  opacity: '1',
  order: '0',
  orientation: '',
  orphans: '2',
  outline: 'rgb(255, 255, 255) none 0px',
  outlineColor: 'rgb(255, 255, 255)',
  outlineOffset: '0px',
  outlineStyle: 'none',
  outlineWidth: '0px',
  overflow: 'visible',
  overflowAnchor: 'auto',
  overflowWrap: 'normal',
  overflowX: 'visible',
  overflowY: 'visible',
  padding: '0px',
  paddingBottom: '0px',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  page: '',
  pageBreakAfter: 'auto',
  pageBreakBefore: 'auto',
  pageBreakInside: 'auto',
  paintOrder: 'fill stroke markers',
  perspective: 'none',
  perspectiveOrigin: '7px 7px',
  pointerEvents: 'auto',
  position: 'static',
  quotes: '',
  r: '0px',
  resize: 'none',
  right: 'auto',
  rx: 'auto',
  ry: 'auto',
  shapeImageThreshold: '0',
  shapeMargin: '0px',
  shapeOutside: 'none',
  shapeRendering: 'auto',
  size: '',
  speak: 'normal',
  src: '',
  stopColor: 'rgb(0, 0, 0)',
  stopOpacity: '1',
  stroke: 'none',
  strokeDasharray: 'none',
  strokeDashoffset: '0px',
  strokeLinecap: 'butt',
  strokeLinejoin: 'miter',
  strokeMiterlimit: '4',
  strokeOpacity: '1',
  strokeWidth: '1px',
  tabSize: '8',
  tableLayout: 'auto',
  textAlign: 'left',
  textAlignLast: 'auto',
  textAnchor: 'start',
  textCombineUpright: 'none',
  textDecoration: 'none',
  textIndent: '0px',
  textOrientation: 'mixed',
  textOverflow: 'clip',
  textRendering: 'auto',
  textShadow: 'rgba(0, 0, 0, 0.2) 0px -1px 0px',
  textSizeAdjust: '100%',
  textTransform: 'none',
  top: 'auto',
  touchAction: 'auto',
  transform: 'none',
  transformOrigin: '7px 7px',
  transformStyle: 'flat',
  transition: 'all 0s ease 0s',
  transitionDelay: '0s',
  transitionDuration: '0s',
  transitionProperty: 'all',
  transitionTimingFunction: 'ease',
  unicodeBidi: 'normal',
  unicodeRange: '',
  userSelect: 'none',
  userZoom: '',
  vectorEffect: 'none',
  verticalAlign: 'text-top',
  visibility: 'visible',
  webkitAppRegion: 'no-drag',
  webkitAppearance: 'none',
  webkitBackgroundClip: 'border-box',
  webkitBackgroundOrigin: 'padding-box',
  webkitBorderAfter: '0px none rgb(255, 255, 255)',
  webkitBorderAfterColor: 'rgb(255, 255, 255)',
  webkitBorderAfterStyle: 'none',
  webkitBorderAfterWidth: '0px',
  webkitBorderBefore: '0px none rgb(255, 255, 255)',
  webkitBorderBeforeColor: 'rgb(255, 255, 255)',
  webkitBorderBeforeStyle: 'none',
  webkitBorderBeforeWidth: '0px',
  webkitBorderEnd: '0px none rgb(255, 255, 255)',
  webkitBorderEndColor: 'rgb(255, 255, 255)',
  webkitBorderEndStyle: 'none',
  webkitBorderEndWidth: '0px',
  webkitBorderHorizontalSpacing: '0px',
  webkitBorderImage: 'none',
  webkitBorderStart: '0px none rgb(255, 255, 255)',
  webkitBorderStartColor: 'rgb(255, 255, 255)',
  webkitBorderStartStyle: 'none',
  webkitBorderStartWidth: '0px',
  webkitBorderVerticalSpacing: '0px',
  webkitBoxAlign: 'stretch',
  webkitBoxDecorationBreak: 'slice',
  webkitBoxDirection: 'normal',
  webkitBoxFlex: '0',
  webkitBoxFlexGroup: '1',
  webkitBoxLines: 'single',
  webkitBoxOrdinalGroup: '1',
  webkitBoxOrient: 'horizontal',
  webkitBoxPack: 'start',
  webkitBoxReflect: 'none',
  webkitColumnBreakAfter: 'auto',
  webkitColumnBreakBefore: 'auto',
  webkitColumnBreakInside: 'auto',
  webkitFontSizeDelta: '',
  webkitFontSmoothing: 'auto',
  webkitHighlight: 'none',
  webkitHyphenateCharacter: 'auto',
  webkitLineBreak: 'auto',
  webkitLineClamp: 'none',
  webkitLocale: 'auto',
  webkitLogicalHeight: '14px',
  webkitLogicalWidth: '14px',
  webkitMarginAfter: '0px',
  webkitMarginAfterCollapse: 'collapse',
  webkitMarginBefore: '0px',
  webkitMarginBeforeCollapse: 'collapse',
  webkitMarginBottomCollapse: 'collapse',
  webkitMarginCollapse: '',
  webkitMarginEnd: '2px',
  webkitMarginStart: '0px',
  webkitMarginTopCollapse: 'collapse',
  webkitMask: '',
  webkitMaskBoxImage: 'none',
  webkitMaskBoxImageOutset: '0px',
  webkitMaskBoxImageRepeat: 'stretch',
  webkitMaskBoxImageSlice: '0 fill',
  webkitMaskBoxImageSource: 'none',
  webkitMaskBoxImageWidth: 'auto',
  webkitMaskClip: 'border-box',
  webkitMaskComposite: 'source-over',
  webkitMaskImage: 'none',
  webkitMaskOrigin: 'border-box',
  webkitMaskPosition: '0% 0%',
  webkitMaskPositionX: '0%',
  webkitMaskPositionY: '0%',
  webkitMaskRepeat: 'repeat',
  webkitMaskRepeatX: '',
  webkitMaskRepeatY: '',
  webkitMaskSize: 'auto',
  webkitMaxLogicalHeight: 'none',
  webkitMaxLogicalWidth: 'none',
  webkitMinLogicalHeight: '0px',
  webkitMinLogicalWidth: '0px',
  webkitPaddingAfter: '0px',
  webkitPaddingBefore: '0px',
  webkitPaddingEnd: '0px',
  webkitPaddingStart: '0px',
  webkitPerspectiveOriginX: '',
  webkitPerspectiveOriginY: '',
  webkitPrintColorAdjust: 'economy',
  webkitRtlOrdering: 'logical',
  webkitRubyPosition: 'before',
  webkitTapHighlightColor: 'rgba(0, 0, 0, 0.180392)',
  webkitTextCombine: 'none',
  webkitTextDecorationsInEffect: 'none',
  webkitTextEmphasis: '',
  webkitTextEmphasisColor: 'rgb(255, 255, 255)',
  webkitTextEmphasisPosition: 'over',
  webkitTextEmphasisStyle: 'none',
  webkitTextFillColor: 'rgb(255, 255, 255)',
  webkitTextOrientation: 'vertical-right',
  webkitTextSecurity: 'none',
  webkitTextStroke: '',
  webkitTextStrokeColor: 'rgb(255, 255, 255)',
  webkitTextStrokeWidth: '0px',
  webkitTransformOriginX: '',
  webkitTransformOriginY: '',
  webkitTransformOriginZ: '',
  webkitUserDrag: 'auto',
  webkitUserModify: 'read-only',
  webkitWritingMode: 'horizontal-tb',
  whiteSpace: 'normal',
  widows: '2',
  width: '14px',
  willChange: 'auto',
  wordBreak: 'normal',
  wordSpacing: '0px',
  wordWrap: 'normal',
  writingMode: 'horizontal-tb',
  x: '0px',
  y: '0px',
  zIndex: 'auto',
  zoom: '1' };
*/
  



module.exports = App;