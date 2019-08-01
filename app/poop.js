(function() {
  let POOP;
  let NEWDIV;
  let FULLFILE;
  let EDITEDFILE;

  let vars = {};  // global scope vars
  let funcs = {};  // global scope functions
  let fnvars = {};  // function scope vars
  let TEMPLATEFOLDER;

  const keywords = {
    'shit' : function (ele) { // "print" to the DOM
      // if (ele[0] === 'p') console.log('ele: ', ele)
      if (Array.isArray(ele)) ele = ele.join('+');
      // element array
      let elementArray = ele.split('+');
      // element index
      let elementIndex = 0;
      // pretty obvious
      let newEle = '';
      // attribute count for element
      let attrCount = 0;
      // time to remove code from poop file
      let readysetsplice = false;

      elementArray.forEach( (item, index) => {
        if (elementIndex) {
          if (item.match(/=/g) && checkEscape(elementArray[index -1])) {  // find attributes to elements
            attrCount++;
            let ind = item.match('=').index;
            let attribute = item.substr(0, ind);
            let value = item.substr(ind + 1);
            if (!attrs[attribute]) return;
            if (!newEle) {
              newEle = attrs[attribute](elementArray[elementIndex - 1], value);
            } else {
              newEle = attrs[attribute](newEle, value);
            }
            readysetsplice = true;
          } else {
            readysetsplice = false;
          }
        }
        if (readysetsplice) {
          elementArray.splice(elementIndex-1, attrCount + 1, newEle).pop();
          newEle = '';
          attrCount = 0;
          elementIndex= 0;
          readysetsplice = false;
        }
        if (Object.keys(html).find( i => i === item || i === item.slice(1))) { // See if it's an html tag
          if (!checkEscape(elementArray[index-1])) {
            elementArray[index-1] = '\u0008';
            return;
          }
          if (item[0] !== '/') {
            elementArray[index] = html[item];
          } else {
            elementArray[index] = endTag(html[item.slice(1)]);
          }
          elementIndex = index + 1; // Adding +1 will make it truthy, even if it's 0 index
        }
        if (!checkEscape(elementArray[index - 1]) && checkEscape(elementArray[index])) elementArray[index - 1] = '';
      });

      function endTag(ele) {
        return ele.slice(0, 1) + '/' + ele.slice(1);
      }
      
      if (NEWDIV) {
        let el = document.createElement('div');
        el.className = 'poop';
        POOP.appendChild(el);
        POOP = el;
        NEWDIV = false;
      }

      elementArray = elementArray.join(' ');
      elementArray = elementArray.replace(/>\s/g, '>');
      elementArray = elementArray.replace(/\s</g, '<');
      console.log('ear: ', elementArray)
      POOP.innerHTML += elementArray;
    },
    'poo' : function () { // sets variables
      let args = arguments[0];
      let fv = args[0];
      args.shift();
      args = findMath(args);
      // args = funcArgsFuncs(args);
      fnvars[fv] = args;
    },
    'crap' : function () { // console log
      let str = arguments[0].join(' ');
      console.log(str);
    }
  };
  const html = {
    'a' : '<a>',
    'b' : '<b>',
    'address' : '<address>',
    'area' : '<area>',
    'article' : '<article>',
    'aside' : '<aside>',
    'audio' : '<audio>',
    'base' : '<base>',
    'bdi' : '<bdi>',
    'bdo' : '<bdo>',
    'blockquote' : '<blockquote>',
    'body' : '<body>',
    'br' : '<br>',
    'button' : '<button>',
    'canvas' : '<canvas>',
    'caption' : '<caption>',
    'cite' : '<cite>',
    'code' : '<code>',
    'col' : '<col>',
    'colgroup' : '<colgroup>',
    'data' : '<data>',
    'datalist' : '<datalist>',
    'dd' : '<dd>',
    'del' : '<del>',
    'details' : '<details>',
    'dfn' : '<dfn>',
    'dialog' : '<dialog>',
    'div' : '<div>',
    'dl' : '<dl>',
    'dt' : '<dt>',
    'em' : '<em>',
    'embed' : '<embed>',
    'fieldset' : '<fieldset>',
    'figure' : '<figure>',
    'footer' : '<footer>',
    'form' : '<form>',
    'h1' : '<h1>',
    'h2' : '<h2>',
    'h3' : '<h3>',
    'h4' : '<h4>',
    'h5' : '<h5>',
    'h6' : '<h6>',
    'head' : '<head>',
    'header' : '<header>',
    'hgroup' : '<hgroup>',
    'hr' : '<hr>',
    'html' : '<html>',
    'i' : '<i>',
    'iframe' : '<iframe>',
    'input' : '<input>',
    'ins' : '<ins>',
    'keygen' : '<keygen>',
    'label' : '<label>',
    'legend' : '<legend>',
    'li' : '<li>',
    'link' : '<link>',
    'main' : '<main>',
    'map' : '<map>',
    'mark' : '<mark>',
    'menu' : '<menu>',
    'menuitem' : '<menuitem>',
    'meta' : '<meta>',
    'meter' : '<meter>',
    'nav' : '<nav>',
    'noscript' : '<noscript>',
    'object' : '<object>',
    'ol' : '<ol>',
    'optgroup' : '<optgroup>',
    'option' : '<option>',
    'output' : '<output>',
    'p' : '<p>',
    'param' : '<param>',
    'pre' : '<pre>',
    'progress' : '<progress>',
    'q' : '<q>',
    'rb' : '<rb>',
    'rp' : '<rp>',
    'rt' : '<rt>',
    'rtc' : '<rtc>',
    'ruby' : '<ruby>',
    's' : '<s>',
    'script' : '<script>',
    'section' : '<section>',
    'select' : '<select>',
    'small' : '<small>',
    'source' : '<source>',
    'span' : '<span>',
    'strong' : '<strong>',
    'style' : '<style>',
    'sub' : '<sub>',
    'summary' : '<summary>',
    'sup' : '<sup>',
    'table' : '<table>',
    'tbody' : '<tbody>',
    'td' : '<td>',
    'template' : '<template>',
    'textarea' : '<textarea>',
    'tfoot' : '<tfoot>',
    'th' : '<th>',
    'thead' : '<thead>',
    'time' : '<time>',
    'title' : '<title>',
    'tr' : '<tr>',
    'track' : '<track>',
    'u' : '<u>',
    'ul' : '<ul>',
    'var' : '<var>',
    'video' : '<video>',
    'wbr' : '<wbr>'
  };
  const attrs = {
    'style' : function (ele, val) {
      return ele.replace('>', ` style="${val}">`);
    },
    'class' : function (ele, val) {
      let classes = val.match(',') ? val.replace(/,/g, ' ') : val;
      return ele.replace('>', ` class="${classes}">`)
    },
    'id' : function(ele, val) {
      return ele.replace('>', ` id="${val}">`)
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    POOP = document.getElementsByTagName('poop')[0];
    // todo get all imported poop files
    TEMPLATEFOLDER = POOP.getAttribute('templates') ? POOP.getAttribute('templates') : 'templates';
    NEWDIV = POOP.getAttribute('newdiv') ? POOP.getAttribute('newdiv') === 'true' : false;
    let file = TEMPLATEFOLDER + '/index2.poop';
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        FULLFILE = req.responseText;
        buildVars();
        buildFuncs();
        buildCSS();
        parseData();
      }
    };
    req.open("GET", file, true);
    req.send();
  });

  function buildCSS() {
    // Beginning of css
    let cssStart = 0;
    // End of css
    let cssEnd = 0;
    // Block style
    let foundItBlock;
    // Single line
    let foundItSingle;
    // Whether or not it is in the file
    let foundIt = false;
    // The code for css in array form
    let cssCodeArr;
    // The code for css in ready-to-use form
    let cssCode;

    if (!EDITEDFILE.find( (i, ind) => {
      // See if it exists as block
      foundItBlock = i === 'dung';
      // If not, see if it exists as a single line
      if (!foundItBlock) foundIt = foundItSingle = i.split(' ')[0] === 'dung';
      else foundIt = true;

      if (foundIt) {
        cssStart = ind;
        return true;
      }

      return false;
    })) return;

    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);

    // If it's block, build it out
    if (foundItBlock) {
      EDITEDFILE.find( (i, ind) => {
        // inconsequential lines
        if (ind <= cssStart) return;
        // end of the block
        const blockEnd = i === 'flush';

        if (blockEnd) {
          // set the cssEnd to the end of the block to where 'flush' is found
          cssEnd = ind;
          return true;
        }

        return false;
      });
      cssCodeArr = EDITEDFILE.splice(cssStart, cssEnd - cssStart + 1);
      cssCodeArr.pop(); // Removes 'dung'
      cssCodeArr.shift();  // Removes 'flush'
    } else { // Otherwise, just use that one line
      cssCodeArr = EDITEDFILE[cssStart].split(' ').splice(1);
      cssCode = `${cssCodeArr[0]} { ${cssCodeArr[1]}: ${cssCodeArr.filter( (r, i) => i > 1).join(' ')} }`;
      styleSheet.insertRule(cssCode);
      return
    }

    let newCssBlock = 0;

    cssCodeArr.forEach( (line, index) => {
      const lineArr = line.split(' ');
      // TODO: currently only works with single selectors like
      // TODO: .className but not with .className .secondClassName
      // TODO: Will update to check for '.' '#' or find in html list
      if (getBlockType(line) && !cssCode) {
        newCssBlock = index;
        cssCode = `${line} {\n`;
      } else if (getBlockType(line) && cssCode) {
        newCssBlock = index;
        cssCode += `\n}\n${line} {\n`;
      } else {
        if (lineArr.length === 2) {
          if (index >= newCssBlock + 2) cssCode += `,\n`;
          cssCode += `  ${lineArr[0]}: ${lineArr[1]}`;
        } else {
          cssCode += `  ${lineArr[0]}: ${lineArr.filter( (r,i) => i > 1).join(' ')}`;
        }
        if (index === cssCodeArr.length - 1) {
          cssCode += `\n}`;
        }
      }
    });

    function getBlockType(b) {
      return b[0] === '.' || b[0] === '#' || html[b.split(' ')[0]];
    }
    styleSheet.innerHTML = cssCode
  }

  function buildVars() {
    const FILE = FULLFILE.split('\n');
    const LINES = FILE.map( line => line.trim() ).filter( (line) => {if (line) return line.trim()});
    EDITEDFILE = LINES;
    const LINESARR = LINES.map( line => line.split(' '));
    // to keep from iterating over the full file multiple times, I'm going
    // to remove any lines that are variable declarations outside of functions
    // however I have to keep track of what indices to remove
    let indRemove = [];
    let foundFunc = false;
    LINESARR.forEach( (line, index) => {
      if (line[0] === 'poop') {
        foundFunc = true;
      }
      if (!foundFunc && line[0] === 'poo') {
        line.shift();
        vars[line.shift()] = line;
        indRemove.push(index);
      }
      if (foundFunc && line[0] === 'flush') {
        foundFunc = false;
      }
    });
    // Loop complete, now remove indices, but in reverse, otherwise it will throw everything off
    indRemove.reverse().forEach( i => EDITEDFILE.splice(i, 1));
    if (Object.size(vars)) {
      for (let k in vars) {
        vars[k].forEach( (item, index) => {
          if (vars.hasOwnProperty(item) && checkEscape(item[index-1])) {  // variable inside variable instantiation
            vars[k][index] = vars[item][0];  // change it to its value
          }
        });
        vars[k] = findMath(vars[k]);
      }
    }
    Object.seal(vars);
  }

  function buildFuncs() {
    const LINESARR = EDITEDFILE.map( line => line.split(' '));
    let currFunc = '';
    let indRemove = [];
    LINESARR.forEach( (item, index) => {
      if (item[0] === 'poop') {
        funcs[item[1].trim()] = [];
        currFunc = item[1].trim();
        indRemove.push(index);
      } else if (currFunc && item[0] === 'flush') {
        funcs[currFunc].push(['flush']);
        currFunc = '';
        indRemove.push(index);
      } else if (currFunc) {
        funcs[currFunc].push(item);
        indRemove.push(index);
      }
    });
    indRemove.reverse().forEach( i => EDITEDFILE.splice(i, 1));
    Object.seal(funcs);
  }

  function convertVarFuncs() {
    if (!Object.size(vars)) return;
    for (let key in vars) {
      if (vars.hasOwnProperty(key)) {
        // console.log(vars[key])
      }
    }
  }

  function funcArgsFuncs(obj) {

  }

  function parseData() {
    const LINESARR = EDITEDFILE.map( line => line.split(' '));
    let block = false;  // blocks of code (html or css)
    let blockType = ''; // type of code block (html or css)
    let ele = '';

    LINESARR.forEach( (item) => {
      if (item[0].trim().substr(0,2) === '//') return;
      if (Object.keys(keywords).find(i => i === item[0])) {  // keyword
        block = kw(item);
        if (block) blockType = item[0];
      } else if (Object.keys(funcs).find(i => i === item[0])) {  // function
        let fblock = false;
        let fnargs = [];  // Build out arguments for the function
        if (item.length > 1) {
          item.forEach( (i, n) => {
            if (n === 0) return;
            if (vars.hasOwnProperty(i) && checkEscape(item[n - 1])) item[n] = vars[i].toString();
          });
          fnargs = item.splice(1);
        }
        funcs[item[0]].forEach( line => {
          if (fnargs.length) {
            line.forEach( (i, n) => {
              if (i.substr(0, 3) === 'arg' && checkEscape(line[n-1])) {
                let argnum = parseInt(i.substr(3) - 1);
                line[n] = fnargs[argnum];
              }
              if (fnvars.hasOwnProperty(i) && checkEscape(line[n-1])) line[n] = fnvars[i];
              if (vars.hasOwnProperty(i) && checkEscape(line[n-1])) line[n] = vars[i];
            })
          } else {
            line.forEach( (i, n) => line[n] = vars[i] && checkEscape(line[n-1]) ? vars[i] : line[n]);
          }
          if (Object.keys(keywords).find(i => i === line[0])) {
            if (line[0] === 'shit' && !line[1]) fblock = true;
            else if (!fblock) {
              let fn = line[0];
              line.shift();
              keywords[fn](line);
            }
          }
          line.forEach( (i,n) => {
            line[n] = fnvars.hasOwnProperty(i) && checkEscape(line[n-1]) ? fnvars[i] : line[n]
          });
          if (fblock) {
            if (line[0] !== 'flush') {
              if (line[0] !== 'shit') {
                line.map(l => ele += l + '+');
              }
            } else {
              ele = ele.substr(0, ele.length - 1);
              fblock = false;
              keywords.shit(ele);
              ele = '';
            }
          }
        })
      }
      if (block) {
        if (item[0] !== 'flush') {
          if (item[0] !== 'shit') {
            item.map(l => ele += l + '+');
          }
        } else {
          ele = ele.substr(0, ele.length - 1);
          block = false;
          keywords.shit(ele);
        }
      }
    })
  }

  function findMath(arr) {
    if (arr.includes('+')
      || arr.includes('-')
      || arr.includes('*')
      || arr.includes('/'))
      return eval(arr.join(' '));
    else
      return arr;
  }

  // Check Escape of 'dook' before value
  // returns true if it IS NOT found, because that's
  // the typical check.  Saves keystrokes that way.
  function checkEscape(v) {return v !== 'dook';}

  function kw(item) {
    let fn = item[0];
    let block = fn === 'shit' || fn === 'dung';
    item = item.map( (i,n) => vars.hasOwnProperty(i) && checkEscape(item[n-1]) ? vars[i] : fnvars.hasOwnProperty(i) && checkEscape(item[n-1]) ? fnvars[i] : i);
    if (!block) {
      item.shift();
      keywords[fn](item)
    } else {
      if (item[1]) {  // block tag but only using 1 line
        item.shift();
        keywords.shit(item);

        block = false;
      }
    }
    return block;
  }
})();


Object.size = function(obj) {
  let size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
