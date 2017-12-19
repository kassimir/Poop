'use strict';

(function () {
  var POOP = void 0;
  var keywords = {
    'shit': function shit(ele) {
      if (Array.isArray(ele)) ele = ele.join('+');
      var elar = ele.split('+');
      var eleInd = 0;
      var newEle = '';
      var attrCount = 0;
      elar.forEach(function (item, index) {
        if (Object.keys(html).findIndex(function (i) {
          return i === item;
        }) !== -1) {
          elar[index] = html[item];
          eleInd = index + 1; // Adding +1 will make it truthy, even if it's 0 index
        }
        if (eleInd) {
          if (item.match('=') && elar[index - 1] !== 'dook') {
            attrCount++;
            var ind = item.match('=').index;
            var attribute = item.substr(0, ind);
            var value = item.substr(ind + 1);
            if (!attrs[attribute]) return;
            if (!newEle) newEle = attrs[attribute](elar[eleInd - 1], value);else newEle = attrs[attribute](newEle, value);
          } else {
            if (newEle) {
              elar.splice(eleInd - 1, attrCount + 1, newEle);
              newEle = '';
              attrCount = 0;
            }
          }
        }
        if (elar[index - 1] === 'dook') elar[index - 1] = '';
      });
      var el = document.createElement('div');
      elar = elar.join(' ');
      elar = elar.replace(/>\s/g, '>');
      elar = elar.replace(/\s</g, '<');
      el.innerHTML = elar;
      POOP.appendChild(el);
    },
    'poo': function poo() {
      var args = arguments[0];
      var fv = args[0];
      args.shift();
      args = findMath(args);
      fnvars[fv] = args;
    },
    'crap': function crap() {
      var str = arguments[0].join(' ');
      console.log(str);
    }
  };
  var html = {
    'div': '<div>',
    '/div': '</div>',
    'p': '<p>',
    '/r': '</p>',
    '/p': '</p>',
    'h1': '<h1>',
    '/h1': '</h1>',
    'h2': '<h2>',
    '/h2': '</h2>'
  };
  var attrs = {
    'style': function style(ele, val) {
      return ele.replace('>', ' style="' + val + '">');
    },
    'class': function _class(ele, val) {
      var classes = val.match(',') ? val.replace(/,/g, ' ') : val;
      return ele.replace('>', ' class="' + classes + '">');
    }
  };

  var ff = void 0,
      editedFile = void 0;
  var vars = {}; // global scope vars
  var funcs = {}; // global scope functions
  var fnvars = {}; // function scope vars
  var templateFolder = void 0;

  document.addEventListener('DOMContentLoaded', function () {
    POOP = document.getElementsByTagName('poop')[0];
    // todo get all imported poop files
    templateFolder = POOP.getAttribute('templates');
    var file = templateFolder + '/index.poop';
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
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
    var FILE = ff.split('\n');
    var LINES = FILE.map(function (line) {
      return line.trim();
    }).filter(function (line) {
      if (line) return line.trim();
    });
    editedFile = LINES;
    var LINESARR = LINES.map(function (line) {
      return line.split(' ');
    });
    // to keep from iterating over the full file multiple times, I'm going
    // to remove any lines that are variable declarations outside of functions
    // however I have to keep track of what indices to remove
    var indRemove = [];
    var foundFunc = false;
    LINESARR.forEach(function (line, index) {
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
    indRemove.reverse().forEach(function (i) {
      return editedFile.splice(i, 1);
    });
    if (Object.size(vars)) {
      var _loop = function _loop(k) {
        vars[k].forEach(function (item, index) {
          if (vars[item]) {
            // variable inside variable instantiation
            vars[k][index] = vars[item][0]; // change it to its value
          }
        });
        findMath(vars[k]);
      };

      for (var k in vars) {
        _loop(k);
      }
    }
    Object.seal(vars);
  }

  function buildFuncs() {
    var LINESARR = editedFile.map(function (line) {
      return line.split(' ');
    });
    var currFunc = '';
    var indRemove = [];
    LINESARR.forEach(function (item, index) {
      if (item[0] === 'poop') {
        funcs[item[1].trim()] = [];
        currFunc = item[1].trim();
        indRemove.push(index);
      } else if (currFunc && item[0] === 'flush') {
        currFunc = '';
        indRemove.push(index);
      } else if (currFunc) {
        funcs[currFunc].push(item);
        indRemove.push(index);
      }
    });
    indRemove.reverse().forEach(function (i) {
      return editedFile.splice(i, 1);
    });
    Object.seal(funcs);
  }

  function parseData() {
    var LINESARR = editedFile.map(function (line) {
      return line.split(' ');
    });
    var block = false; // variable for noticing tag signifying potential blocks of code (html or css)
    var ele = '';
    LINESARR.forEach(function (item) {
      if (Object.keys(keywords).findIndex(function (i) {
        return i === item[0];
      }) !== -1) {
        block = kw(item);
      } else if (Object.keys(funcs).findIndex(function (i) {
        return i === item[0];
      }) !== -1) {
        var fnargs = []; // Build out arguments for the function
        if (item.length > 1) {
          item.forEach(function (i, n) {
            if (n === 0) return;
            if (vars[i]) item[n] = vars[i].toString();
          });
          fnargs = item.splice(1);
        }
        funcs[item[0]].forEach(function (line) {
          if (fnargs.length) {
            line.forEach(function (i, n) {
              if (i.substr(0, 3) === 'arg' && line[n - 1] !== 'dook') {
                var argnum = parseInt(i.substr(3) - 1);
                line[n] = fnargs[argnum];
              }
            });
          }
          // console.log(line);
          if (Object.keys(keywords).findIndex(function (i) {
            return i === line[0];
          }) !== -1) {
            block = kw(line);
          }
        });
      }
      if (block) {
        if (item[0] !== 'flush') {
          if (item[0] !== 'shit') {
            item.map(function (l) {
              return ele += l + '+';
            });
          }
        } else {
          ele = ele.substr(0, ele.length - 1);
          block = false;
          keywords.shit(ele);
        }
      }
    });
  }

  function findMath(arr) {
    if (arr.includes('+') || arr.includes('-') || arr.includes('*') || arr.includes('/')) return eval(arr.join(' '));else return arr;
  }

  function kw(item) {
    var fn = item[0];
    var block = fn === 'shit';
    item = item.map(function (i, n) {
      return vars[i] && item[n - 1] !== 'dook' ? vars[i] : fnvars[i] && item[n - 1] !== 'dook' ? fnvars[i] : i;
    });
    if (!block) {
      item.shift();
      keywords[fn](item);
    } else {
      if (item[1]) {
        // block tag but only using 1 line
        item.shift();
        keywords.shit(item);
        block = false;
      }
    }
    return block;
  }
})();

Object.size = function (obj) {
  var size = 0,
      key = void 0;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};