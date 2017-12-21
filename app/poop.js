(function() {
  let POOP;
  let NEWDIV;

  const keywords = {
    'shit' : function (ele) {
      if (Array.isArray(ele)) ele = ele.join('+');
      let elar = ele.split('+');
      let eleInd = 0;
      let newEle = '';
      let attrCount = 0;
      let readysetsplice = false;
      elar.forEach( (item, index) => {
        if (eleInd) {
          if (item.match(/=/g) && ce(elar[index -1])) {  // find attributes to elements
            attrCount++;
            let ind = item.match('=').index;
            let attribute = item.substr(0, ind);
            let value = item.substr(ind + 1);
            if (!attrs[attribute]) return;
            if (!newEle)
              newEle = attrs[attribute](elar[eleInd - 1], value);
            else
              newEle = attrs[attribute](newEle, value);
          } else {
            readysetsplice = true;
          }
        }
        if (readysetsplice) {
          // splicearr.reverse().forEach( i => elar.splice(eleInd - 1, i))
          elar.splice(eleInd - 1, attrCount + 1, newEle);
          newEle = '';
          attrCount = 0;
          eleInd= 0;
          readysetsplice = false;
        }
        if (Object.keys(html).find( i => i === item)) {
          if (!ce(elar[index-1])) {
            elar[index-1] = '';
            return;
          }
          elar[index] = html[item];
          eleInd = index + 1; // Adding +1 will make it truthy, even if it's 0 index
        }
        if (!ce(elar[index - 1]) && ce(elar[index])) elar[index - 1] = '';
      });
      
      if (NEWDIV) {
        let el = document.createElement('div');
        el.className = 'poop';
        elar = elar.join(' ');
        elar = elar.replace(/>\s/g, '>');
        elar = elar.replace(/\s</g, '<');
        el.innerHTML = elar;
        POOP.appendChild(el);
      } else {
        elar = elar.join(' ');
        elar = elar.replace(/>\s/g, '>');
        elar = elar.replace(/\s</g, '<');
        POOP.innerHTML += elar;
      }
    },
    'poo' : function () {
      let args = arguments[0];
      let fv = args[0];
      args.shift();
      args = findMath(args);
      args = funcArgsFuncs(args);
      fnvars[fv] = args;
    },
    'crap' : function () {
      let str = arguments[0].join(' ');
      console.log(str);
    }
  };
  const html = {
    'div' : `<div>`,
    '/div' : `</div>`,
    'p' : `<p>`,
    '/r' : `</p>`,
    '/p' : `</p>`,
    'h1' : `<h1>`,
    '/h1' : `</h1>`,
    'h2' : `<h2>`,
    '/h2' : `</h2>`
  };
  const attrs = {
    'style' : function (ele, val) {
      return ele.replace('>', ' style="' + val + '">');
    },
    'class' : function (ele, val) {
      let classes = val.match(',') ? val.replace(/,/g, ' ') : val;
      return ele.replace('>', ' class="' + classes + '">')
    }
  };

  let ff, editedFile;
  let vars = {};  // global scope vars
  let funcs = {};  // global scope functions
  let fnvars = {};  // function scope vars

  document.addEventListener('DOMContentLoaded', function() {
    POOP = document.getElementsByTagName('poop')[0];
    // todo get all imported poop files
    let TEMPLATEFOLDER;

    TEMPLATEFOLDER = POOP.getAttribute('templates') ? POOP.getAttribute('templates') : 'templates';
    NEWDIV = POOP.getAttribute('newdiv') ? POOP.getAttribute('newdiv') === 'true' : false;
    let file = TEMPLATEFOLDER + '/index.poop';
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        ff = req.responseText;
        buildVars();
        buildFuncs();
        parseData();
      }
    };
    req.open("GET", file, true);
    req.send();
  });

  function buildVars() {
    const FILE = ff.split('\n');
    const LINES = FILE.map( line => line.trim() ).filter( (line) => {if (line) return line.trim()});
    editedFile = LINES;
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
    indRemove.reverse().forEach( i => editedFile.splice(i, 1));
    if (Object.size(vars)) {
      for (let k in vars) {
        vars[k].forEach( (item, index) => {
          if (vars.hasOwnProperty(item) && ce(item[index-1])) {  // variable inside variable instantiation
            vars[k][index] = vars[item][0];  // change it to its value
          }
        });
        findMath(vars[k]);
      }
    }
    Object.seal(vars);
  }

  function buildFuncs() {
    const LINESARR = editedFile.map( line => line.split(' '));
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
    indRemove.reverse().forEach( i => editedFile.splice(i, 1));
    Object.seal(funcs);
  }

  function convertVarFuncs() {
    if (!Object.size(vars)) return;
    for (let key in vars) {
      if (vars.hasOwnProperty(key)) {
        console.log(vars[key])
      }
    }
  }

  function funcArgsFuncs(obj) {

  }

  function parseData() {
    const LINESARR = editedFile.map( line => line.split(' '));
    let block = false;  // variable for noticing tag signifying potential blocks of code (html or css)
    let ele='';
    LINESARR.forEach( (item) => {
      if (item[0].substr(0,2) === '//') return;
      if (Object.keys(keywords).find(i => i === item[0])) {  // keyword
        block = kw(item);
      } else if (Object.keys(funcs).find(i => i === item[0])) {  // function
        let fblock = false;
        let fnargs = [];  // Build out arguments for the function
        if (item.length > 1) {
          item.forEach( (i, n) => {
            if (n === 0) return;
            if (vars.hasOwnProperty(i) && ce(item[n - 1])) item[n] = vars[i].toString();
          });
          fnargs = item.splice(1);
        }
        funcs[item[0]].forEach( line => {
          if (fnargs.length) {
            line.forEach( (i, n) => {
              if (i.substr(0, 3) === 'arg' && ce(line[n-1])) {
                let argnum = parseInt(i.substr(3) - 1);
                line[n] = fnargs[argnum];
              }
              if (fnvars.hasOwnProperty(i) && ce(line[n-1])) line[n] = fnvars[i];
              if (vars.hasOwnProperty(i) && ce(line[n-1])) line[n] = vars[i];
            })
          } else {
            line.forEach( (i, n) => line[n] = vars[i] && ce(line[n-1]) ? vars[i] : line[n]);
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
            line[n] = fnvars.hasOwnProperty(i) && ce(line[n-1]) ? fnvars[i] : line[n]
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
  function ce(v) {return v !== 'dook';}

  function kw(item) {
    let fn = item[0];
    let block = fn === 'shit';
    item = item.map( (i,n) => vars.hasOwnProperty(i) && ce(item[n-1]) ? vars[i] : fnvars.hasOwnProperty(i) && ce(item[n-1]) ? fnvars[i] : i);
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
