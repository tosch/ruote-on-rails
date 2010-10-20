//
// Copyright (c) 2010, John Mettraux, jmettraux@gmail.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

var Jagaimo = function () {

  //
  // render()

  function create (container, tagName, className, innerText) {

    var e = document.createElement(tagName);
    if (className) e.className = className;
    if (innerText) e.appendChild(document.createTextNode(innerText));
    if (container) container.appendChild(e);
    return e;
  }

  function isArray (o) {
    try { return o.constructor.toString().match(/function Array\(/); }
    catch (e) { return false; }
  }

  function renderFlat (container, o) {

    if (isArray(o)) {

      create(container, 'span', 'jagaimo_bracket', '[');
      for (var i = 0; i < o.length; i++) {
        renderFlat(container, o[i]);
        if (i < o.length - 1) {
          create(container, 'span', 'jagaimo_comma', ',');
        }
      }
      create(container, 'span', 'jagaimo_bracket', ']');
    }
    else if ((typeof o) === 'object') {

      create(container, 'span', 'jagaimo_brace', '{');

      var keys = [];
      for (var k in o) keys.push(k);

      for (var i = 0; i < keys.length; i++) {
        create(container, 'span', 'jagaimo_key', keys[i]);
        create(container, 'span', 'jagaimo_colon', ':');
        renderFlat(container, o[keys[i]]);
        if (i < keys.length - 1) {
          create(container, 'span', 'jagaimo_comma', ',');
        }
      }
      create(container, 'span', 'jagaimo_brace', '}');
    }
    else {

      create(
        container,
        'span',
        'jagaimo_atom jagaimo_' + (typeof o),
        JSON.stringify(o));
    }
  }

  function renderTree (container, o) {

    if ((typeof o) !== 'object') {

      create(
        container,
        'span',
        'jagaimo_tree_atom jagaimo_' + (typeof o),
        o.toString());
      return;
    }

    var line = create(container, 'div', 'jagaimo_tree_line');

    if (isArray(o)) {

      for (var i = 0; i < o.length; i++) {
        var bullet = create(line, 'div', 'jagaimo_tree_bullet', '- ');
        renderTree(bullet, o[i]);
      }
    }
    else {

      var keys = [];
      for (var k in o) keys.push(k);
      keys = keys.sort();

      for (var i = 0; i < keys.length; i++) {
        var key = create(line, 'div', 'jagaimo_tree_key', keys[i] + ': ');
        renderTree(key, o[keys[i]]);
      }
    }
  }

  function render (containerId, o, opts) {

    var container = containerId;
    opts = opts || {};

    if ((typeof containerId) === 'string') {
      if (containerId.match(/^#/)) containerId = containerId.slice(1);
      container = document.getElementById(containerId);
    }

    var fc; while (fc = container.firstChild) { container.removeChild(fc); }

    var flat = create(container, 'div', 'jagaimo_flat');

    renderFlat(flat, o);

    var tree = create(container, 'div', 'jagaimo_tree');
    tree.style.display = 'none';

    renderTree(tree, o);

    container.onclick = function () {
      if (flat.style.display === 'none') {
        flat.style.display = 'block';
        tree.style.display = 'none';
      }
      else {
        flat.style.display = 'none';
        tree.style.display = 'block';
      }
    };
    container.style.cursor = 'pointer';

    if (opts.mode === 'tree') container.onclick();
  }

  return {

    render: render
  };
}();

