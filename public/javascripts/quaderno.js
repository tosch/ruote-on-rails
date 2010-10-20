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

// depends on the excellent jquery[-1.4.2]


var Quaderno = function () {

  //
  // misc

  function clog (o) {
    try {
      if (arguments.length == 1) console.log(arguments[0]);
      else console.log(arguments);
    }
    catch (e) {
      //if (navigator.userAgent...)
      if (arguments.length == 1) print(JSON.stringify(arguments[0]));
      else print(JSON.stringify(arguments));
    }
  }

  function deepCopy (o) {
    return JSON.parse(JSON.stringify(o));
  }

  function removeClassDot (cname) {
    return (cname.match(/^\./)) ? cname.slice(1) : cname;
  }

  function hide (container, cname, value) {
    cname = removeClassDot(cname);
    return create(
      container, 'input', { 'class': cname, 'type': 'hidden', 'value': value });
  }

  function create (container, tagName, attributes, innerText) {

    var atts = attributes || {};

    if (attributes && ((typeof attributes) === 'string')) {
      atts = { 'class': attributes };
    }
    if (atts['class']) {
      atts['class'] = $.trim((atts['class'] || '').split('.').join(' '));
    }

    var e = $('<' + tagName + '/>', atts)[0];

    if (innerText) {
      //e.innerHTML = innerText;
        // doesn't work with Safari and doesn't escape text
      e.appendChild(document.createTextNode(innerText));
        // is fine
    }

    if (container) {
      container.appendChild(e);
    }

    return e;
  }

  function button (container, cname, onclick, title) {

    if ( ! onclick.match(/return false;$/)) onclick += " return false;";
    var m = cname.match(/quad_([^_]+)_button/);

    title = title || m ? {
      'plus': translate(container, 'quaderno.button.add', 'add'),
      'minus': translate(container, 'quaderno.button.remove', 'remove'),
      'up': translate(container, 'quaderno.button.up', 'move up'),
      'down': translate(container, 'quaderno.button.down', 'move down'),
      'copy': translate(container, 'quaderno.button.duplicate', 'duplicate'),
      //'cut': translate(container, 'quaderno.button.cut', 'cut'),
      //'paste': translate(container, 'quaderno.button.paste', 'paste'),
      //'go': translate(container, 'quaderno.button.go', 'go'),
      //'left': translate(container, 'quaderno.button.left', 'left'),
      //'right': translate(container, 'quaderno.button.right', 'right')
    }[m[1]] : undefined;

    return create(
      container,
      'a',
      { 'href': '',
        'class': cname + '.quad_button',
        'title': title,
        'onClick': onclick });
  }

  //
  // lookup and set

  function lookup (coll, key) {

    //clog([ "lu", key, coll ]);

    if (coll === undefined) return undefined;
    if (key === undefined) return undefined;

    if ( ! $.isArray(key)) key = key.split('.');
    if (key.length < 1) return coll;

    return lookup(coll[key.shift()], key);
  }

  function set (coll, key, value) {

    //clog([ "set", hash, key, value ]);

    if ( ! key) return;

    if ( ! $.isArray(key)) key = key.split('.');

    var k = key.shift();

    if (key.length === 0) {
      coll[k] = value;
      return;
    }

    var scoll = coll[k];

    if (
      scoll === undefined &&
      ($.isArray(coll) || ((typeof coll) === 'object'))
    ) {
      var o = (key[0] && key[0].match(/^\d+$/)) ? [] : {};
      coll[k] = o;
      scoll = coll[k];
    }

    set(scoll, key, value);
  }

  //
  // parsing

  function parseAttributes (s) {

    // id "text" value \[ values \] "title" [disabled]

    // TODO : >value< if necessary

    var atts = {};
    var m;

    // id

    if ((typeof s) !== 'string') return atts;

    m = s.match(/^([^ "]+) ?(.+)?$/)

    if (m && m[1]) {
      atts.id = m[1];
      s = m[2] || '';
    }

    // "text"

    if ((typeof s) !== 'string') return atts;

    m = s.match(/^"([^"]+)" ?(.+)?$/)

    if (m && m[1]) {
      atts.text = m[1];
      s = m[2] || '';
    }

    // values

    m = s.match(/^(\[.+\]) ?(.+)?$/)

    if (m && m[1]) {
      var vs = m[1].slice(1, -1).split(',');
      var values = [];
      for (var i = 0; i < vs.length; i++) { values.push($.trim(vs[i])); }
      atts.values = values.length === 1 ? values[0] : values;
      s = m[2] || '';
    }

    // title

    m = s.match(/^"([^"]+)" ?(.+)?$/)

    if (m) {
      atts.title = m[1];
      s = m[2] || '';
    }

    // disabled

    if (s.match(/disabled$/)) atts.disabled = true;

    return atts;
  }

  function parse (s) {

    var lines = s.split('\n');

    var current;
    var clevel = -1;
    var definitions = {};

    for (var i = 0; i < lines.length; i++) {

      var line = lines[i];
      var tline = $.trim(line);

      if (tline == '') continue;
      if (tline.match(/^\/\//)) continue; // // comment line
      if (tline.match(/^#/)) continue; // # comment line

      var m = line.match(/^([ ]*)([^ ]+) ?(.+)?\r?$/)
        // notice the \r?

      var nlevel = m[1].length / 2;

      var key = $.trim(m[2]);

      var def = definitions[key];
      var elt = [ key, parseAttributes($.trim(m[3])), [] ];

      if (nlevel > clevel) {
        elt.parent = current;
      }
      else if (nlevel == clevel) {
        elt.parent = current.parent;
      }
      else /* nlevel < clevel */ {
        for (var j = 0; j <= clevel - nlevel; j++) {
          current = current.parent;
        }
        elt.parent = current;
      }

      if (def) {
        def = deepCopy(def);
        for (var j = 0; j < def.length; j++) {
          elt.parent[2].push(def[j]);
        }
      }
      else if (elt[0] === 'define') {
        definitions[elt[1].id] = elt[2];
      }
      else if (elt.parent) { // don't place macros in parent
        elt.parent[2].push(elt);
      }

      current = elt;
      clevel = nlevel;
    }

    // get back to 'root'

    while (current.parent) { current = current.parent; }

    // done

    return current;
  }

  //
  // rendering and producing

  var renderers = {};
  var handlers = {};

  renderers.render_ = function (container, template, data, options) {
    create(container, 'span', {}, JSON.stringify(template));
  }

  function renderChildren (container, template, data, options) {
    for (var i = 0; i < template[2].length; i++) {
      renderElement(container, template[2][i], data, options);
    }
  }

  renderers.produce_ = function (container, data) {
    var type = childValue(container, '.quad_type');
    if ( ! data._quad_produce_failures) data._quad_produce_failures = [];
    data._quad_produce_failures.push("can't deal with '" + type + "'");
  }

  function produceChildren (container, data) {
    $(container).children('.quad_element').each(function (i, e) {
      produceElement(e, data, i);
    });
  }

  renderers.produce__array = function (container, data) {

    produceChildren(container, data);

    // truncate array to desired length if necessary

    var a = lookup(data, currentId(container));
    var targetLength = $(container).children('.quad_element').length;

    while (a && a.length > targetLength) { a.pop(); }
  }

  function translate (elt, text, def) {

    if ( ! text) return def;
    if (text.match(/\s/)) return def || text;

    var opts = root(elt).options;
    var t = lookup(opts.translations[opts.lang || 'en'], text)
    return ((typeof t) === 'string') ? t : def || text;
  }

  function getKey (container, template, data, id) {

    var text = template[1].text;

    if (text) {
      if (text.match(/^\./)) {
        var key = currentId(container, text);
        var d = lookup(data, key);
        if (d) return d;
      }
      return translate(container, text);
    }

    text = translate(container, id)

    if (text && text !== id) return text;

    return template[1].id;
  }

  //
  // stacking for undoing

  function stack (elt) {

    var r = root(elt);
    var firstElt = $(r).children('.quad_element')[0];
    var copy = firstElt.cloneNode(true);

    var notFirstPush = r.stack.length > 0;

    r.stack.push(copy);
    while (r.stack.length > 14) r.stack.shift();

    var callback = r.onQuadernoChange;
    if (notFirstPush && callback) {
      var product = (callback.length > 1) ? produce(r) : null;
      callback(elt, product);
    }
  }

  handlers.stackOnKey = function (elt) {

    if (elt.stacked) return;

    $(elt).attr('value', elt.value);
    stack(elt);
    elt.stacked = true;
    $(elt).val('');
  }

  handlers.stackOnClick = function (elt) {

    // checkboxes

    var $elt = $(elt);

    var checked = $elt.attr('checked');
    $elt.attr('checked', ! checked);
    stack(elt);
    $elt.attr('checked', checked);
  }

  handlers.stackOnChange = function (elt) {

    var $elt = $(elt);
    var tagname = elt.tagName.toLowerCase();

    if (elt.type === 'text') {

      elt.stacked = false;
    }
    else if (tagname === 'select') {

      var newValue = elt.value;
      setSelectValue(elt, elt.previousValue);
      stack(elt);
      setSelectValue(elt, newValue);
      elt.previousValue = newValue;
    }
    else if (tagname === 'textarea') {

      stack(elt);
      $elt.text(elt.value);
    }
  }

  //
  // select helpers

  // Setting the value in hard (to make cloneNode()'s work easier...
  //
  function setSelectValue (sel, value) {

    value = '' + value;

    var opts = $(sel).children('option');

    for (var i = 0; i < opts.length; i++) {

      var opt = opts[i]; var $opt = $(opt);

      var atts = { 'value': $opt.attr('value') };
      if ($opt.attr('value') === value) atts.selected = 'selected';
      var text = $opt.text();

      $opt.remove();

      create(sel, 'option', atts, text);
    }
  }

  function createSelect (container, cname) {

    return create(
      container,
      'select',
      { 'class': cname,
        'onFocus': 'this.previousValue = this.value;',
        'onChange': 'Quaderno.handlers.stackOnChange(this);' });
  }

  //
  // select

  renderers.render_select = function (container, template, data, options) {

    var id = currentId(container);

    create(
      container, 'span', '.quad_key', getKey(container, template, data, id));

    var select = createSelect(container, '.quad_value');

    if (id) select.id = 'quad__' + id.replace(/[\.]/, '_', 'g');
      // for webrat / capybara

    var value = lookup(data, id);
    var values = template[1].values || [];

    if ( ! $.isArray(values)) values = lookup(data, values);
    if ( ! $.isArray(values)) values = [ '' + values ];

    for (var i = 0; i < values.length; i++) {

      var v = values[i];
      var t = translate(container, v);
      if (t && v !== t) {
        var m = v.match(/[^\.]+$/)
        v = m[0];
      }

      var opt = create(select, 'option', { 'value': v }, t);

      //if (value && values[i] === value) $(opt).attr('selected', 'selected');
    }

    if (value) setSelectValue(select, value);

    if (template[1].disabled || options.mode === 'view') {
      $(select).attr('disabled', 'disabled');
    }
  }

  renderers.produce_select = function (container, data) {

    var sel = $(container).children('.quad_value')[0];
    set(data, currentId(container), sel.value);
  }

  //
  // checkbox

  renderers.render_checkbox = function (container, template, data, options) {

    var id = currentId(container);
    //var text = template[1].text || template[1].id;

    var checkbox = create(
      container,
      'input',
      { 'class': 'quad_checkbox',
        'type': 'checkbox',
        'onClick': 'Quaderno.handlers.stackOnClick(this);' });

    if (id) {

      checkbox.id = 'quad__' + id.replace(/[\.]/, '_', 'g');
        // for webrat / capybara

      var value = lookup(data, id) || '';
    }

    if (value === true) $(checkbox).attr('checked', 'checked');

    if (template[1].disabled || options.mode === 'view') {
      $(checkbox).attr('disabled', 'disabled');
    }

    create(
      container, 'span', '.quad_checkbox_key', getKey(
        container, template, data, id));
  }

  renderers.produce_checkbox = function (container, data) {

    var cb = $(container).children('.quad_checkbox')[0];
    set(data, currentId(container), $(cb).attr('checked'));
  }

  //
  // text_input

  renderers.render_text_input = function (container, template, data, options) {

    var id = currentId(container);

    create(
      container, 'span', '.quad_key', getKey(container, template, data, id));

    var input = create(
      container,
      'input',
      { 'class': 'quad_value',
        'type': 'text',
        'onKeyPress': 'Quaderno.handlers.stackOnKey(this);',
        'onChange': 'Quaderno.handlers.stackOnChange(this);' });

    if (id) {

      input.id = 'quad__' + id.replace(/[\.]/, '_', 'g');
        // for webrat / capybara

      $(input).attr('value', lookup(data, id) || '');
    }

    if (template[1].disabled || options.mode === 'view') {
      $(input).attr('disabled', 'disabled');
    }
  }

  renderers.produce_text_input = function (container, data) {
    var value = childValue(container, '.quad_value');
    set(data, currentId(container), value);
  }

  //
  // text_area

  renderers.render_text_area = function (container, template, data, options) {

    var id = currentId(container);

    create(
      container, 'span', '.quad_key', getKey(container, template, data, id));

    var value = '';
    var aid = '';

    if (id) {

      value = lookup(data, id) || '';

      aid = 'quad__' + id.replace(/[\.]/, '_', 'g');
        // for webrat / capybara
    }

    var area = create(
      container,
      'textarea',
      { 'id': aid,
        'class': 'quad_value',
        'onKeyPress' : 'Quaderno.handlers.stackOnKey(this);',
        'onChange': 'Quaderno.handlers.stackOnChange(this);' },
      value);

    if (template[1].disabled || options.mode === 'view') {
      $(area).attr('disabled', 'disabled');
    }
  }

  renderers.produce_text_area = function (container, data) {
    var value = childValue(container, '.quad_value');
    set(data, currentId(container), value);
  }

  //
  // text

  renderers.render_text = function (container, template, data, options) {

    var id = currentId(container);

    if (template[1].id) {
      create(
        container, 'span', '.quad_key', getKey(container, template, data, id));
      create(
        container, 'span', '.quad_value.quad_text', lookup(data, id));
    }
    else {
      var text = template[1].text || lookup(data, id) || '';
      create(
        container, 'div', '.quad_key.quad_text', translate(container, text));
    }
  }

  renderers.produce_text = function (container, data) {
    // nothing to do
  }

  //
  // date

  renderers.render_date = function (container, template, data, options) {

    var id = currentId(container);

    create(
      container, 'span', '.quad_key', getKey(container, template, data, id));

    var type = template[0].split('_')[1] || 'ymd';

    // year

    var year;

    if (type.match(/y/)) {

      create(
        container, 'span', '.quad_date_separator',
        translate(container, 'date.y', 'y'));

      var y = (new Date()).getYear() + 1900;
      year = createSelect(container, '.quad_date_year');
      for (var i = 2000; i < 2050; i++) {
        create(year, 'option', { 'value': '' + i }, i);
      }
      setSelectValue(year, y);
      $(year).attr('onChange', 'Quaderno.handlers.checkDate(this, "' + type + '");');

      if (id) { // for webrat / capybara
        year.id = 'quad__' + id.replace(/[\.]/, '_', 'g') + '__year';
      }
    }

    // month

    var month;

    if (type.match(/m/)) {

      create(
        container, 'span', '.quad_date_separator',
        translate(container, 'date.m', 'm'));

      month = createSelect(container, '.quad_date_month');
      for (var i = 1; i <= 12; i++) {
        create(month, 'option', { 'value': '' + i }, i);
      }
      $(month).attr('onChange', 'Quaderno.handlers.checkDate(this, "' + type + '");');

      if (id) { // for webrat / capybara
        month.id = 'quad__' + id.replace(/[\.]/, '_', 'g') + '__month';
      }
    }

    // day

    var day;

    if (type.match(/d/)) {

      create(
        container, 'span', '.quad_date_separator',
        translate(container, 'date.d', 'd'));

      day = createSelect(container, '.quad_date_day');
      for (var i = 1; i <= 31; i++) {
        create(day, 'option', { 'value': '' + i }, i);
      }

      if (id) { // for webrat / capybara
        day.id = 'quad__' + id.replace(/[\.]/, '_', 'g') + '__day';
      }
    }

    // set value

    var value = lookup(data, id);

    if (value) {

      value = value.split('/');

      if (year) setSelectValue(year, new Number(value.shift()));
      if (month) setSelectValue(month, new Number(value.shift()));
      if (day) setSelectValue(day, new Number(value.shift()));
    }

    // mode view => disable

    if (template[1].disabled || options.mode === 'view') {

      if (year) $(year).attr('disabled', 'disabled');
      if (month) $(month).attr('disabled', 'disabled');
      if (day) $(day).attr('disabled', 'disabled');
    }
  }
  renderers.render_date_ymd = renderers.render_date;
  renderers.render_date_y = renderers.render_date;
  renderers.render_date_ym = renderers.render_date;
  renderers.render_date_md = renderers.render_date;
  
  renderers.produce_date = function (container, data) {

    var dateElt = $(container);
    var year = dateElt.children('.quad_date_year')[0];
    var month = dateElt.children('.quad_date_month')[0];
    var day = dateElt.children('.quad_date_day')[0];

    var a = [];
    if (year) a.push(year.value);
    if (month) a.push(month.value);
    if (day) a.push(day.value);

    set(data, currentId(container), a.join('/'));
  }
  renderers.produce_date_ymd = renderers.produce_date;
  renderers.produce_date_y = renderers.produce_date;
  renderers.produce_date_ym = renderers.produce_date;
  renderers.produce_date_md = renderers.produce_date;

  var MD = [ 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

  function isLeapYear (year) {
    var d = new Date();
    d.setFullYear(year, 1, 29);
    return (d.getMonth() == 1);
  }

  handlers.checkDate = function (elt, type) {

    handlers.stackOnChange(elt);

    if ( ! type.match(/d/)) return;

    var dateElt = $(elt.parentNode);
    var year = dateElt.children('.quad_date_year')[0];
    var month = dateElt.children('.quad_date_month')[0];
    var day = dateElt.children('.quad_date_day')[0];

    if (type === 'ymd') {

      var d = new Date();

      d.setFullYear(
        parseInt(year.value), parseInt(month.value) - 1, parseInt(day.value));

      setSelectValue(year, d.getFullYear());
      setSelectValue(month, d.getMonth() + 1);
      setSelectValue(day, d.getDate());
    }

    // adjust days (february and co)

    var d = day.value;

    while (day.firstChild) { day.removeChild(day.firstChild); }

    var days = MD[month.value];
    if (
      month && month.value == 2 && year && isLeapYear(year.value)
    ) days = days + 1;

    for (var i = 1; i <= days; i++) {
      create(day, 'option', { 'value': '' + i }, i);
    }

    setSelectValue(day, d);
  }

  //
  // box

  renderers.render_box = function (container, template, data, options) {

    $(container).addClass('quad_box');

    var label = getKey(container, template, data, currentId(container));

    if (label != template[1].id) {
      create(container, 'span', '.quad_label', label);
    }

    renderChildren(container, template, data, options);
  }

  renderers.produce_box = function (container, data) {
    produceChildren(container, data);
  }

  //
  // group

  renderers.render_group = function (container, template, data, options) {

    var label = getKey(container, template, data, currentId(container));

    if (label != template[1].id) {
      create(container, 'span', '.quad_label', label);
    }

    renderChildren(container, template, data, options);
  }

  renderers.produce_group = function (container, data) {
    produceChildren(container, data);
  }

  //
  // tabs

  renderers.render_tab = function (container, template, data, options) {
    renderChildren(container, template, data, options);
  }

  renderers.render_tab_label = function (container, template, data, options) {

    var td = create(container, 'td', {});

    var id = currentId(container);
    var text = template[1].text || template[1].id;

    var a = $(create(td, 'a', '.quad_tab', translate(container, text)));
    a.attr('href', '');
    a.attr('onClick', 'return Quaderno.handlers.showTab(this.parentNode);');

    return td;
  }

  renderers.render_tabs = function (container, template, data, options) {

    var tabs = template[2];

    var table = create(container, 'table', '.quad_tab_group');

    // tabs

    var tr0 = create(table, 'tr', '.quad_tab_group');

    for (var i = 0; i < tabs.length; i++) {
      renderers.render_tab_label(tr0, tabs[i], data, options);
    }

    var tab = $(tr0).find('td > .quad_tab')[0];
    $(tab).addClass('quad_selected');

    // content

    var tr = create(table, 'tr', '.quad_tab_group');
    var td = create(tr, 'td', { 'colspan': tabs.length });
    var qtb = create(td, 'div', '.quad_tab_body');

    for (var i = 0; i < tabs.length; i++) {
      var div = renderElement(qtb, tabs[i], data, options);
      if (i != 0) div.style.display = 'none';
    }

    return table;
  }

  function computeSiblingOffset (elt, sel) {
    var cs = $(elt.parentNode).children(sel);
    for (var i = 0; i < cs.length; i++) {
      if (cs[i] == elt) return i;
    }
    return -1;
  }
  function findTabBody (elt) {
    var td = $(elt).parents('td')[0];
    var index = computeSiblingOffset(td);
    var table = $(elt).parents('table')[0];
    var tr = $(table).children('tr')[1];
    return $(tr).find('td > .quad_tab_body > .quad_element')[index];
  }

  function showTab (td) {

    for (var i = 0; i < td.parentNode.children.length; i++) {
      var tab = $(td.parentNode.children[i]).children('.quad_tab');
      tab.removeClass('quad_selected');
    }
    var tab = $(td).children('.quad_tab');
    tab.addClass('quad_selected');

    var tab_body = findTabBody(tab);

    for (var i = 0; i < tab_body.parentNode.children.length; i++) {
      tab_body.parentNode.children[i].style.display = 'none';
    }
    tab_body.style.display = 'block';

    return false; // no further HTTP request...
  }
  handlers.showTab = showTab;

  renderers.produce_tabs = function (elt, data) {
    var body = $(elt).find('.quad_tab_body')[0];
    produceChildren(body, data);
  }

  renderers.produce_tab = function (elt, data) {
    produceChildren(elt, data);
  }

  //
  // array handlers

  function addRemoveButton (elt) {
    button(
      elt,
      '.quad_minus_button.array_remove_button',
      'Quaderno.handlers.removeFromArray(this);');
  }
  function addReorderButtons (elt) {
    button(
      elt,
      '.quad_up_button.array_move_button',
      'Quaderno.handlers.moveInArray(this, "up");');
    button(
      elt,
      '.quad_down_button.array_move_button',
      'Quaderno.handlers.moveInArray(this, "down");');
  }
  function addDuplicateButton (elt) {
    button(
      elt,
      '.quad_copy_button.array_duplicate_button',
      'Quaderno.handlers.duplicateInArray(this);');
  }

  handlers.addToArray = function (elt) {

    stack(elt);

    var t = JSON.parse(childValue(elt.parentNode, '.quad_array_template'));
    var tid = t[1].id;
    t[1].id = '.0';

    var r = root(elt);

    renderElement(elt.parentNode, t, r.data, r.options);
    elt.parentNode.insertBefore(elt.nextSibling, elt);

    if (tid.match(/[\*-]/)) addRemoveButton(elt.previousSibling);
    if (tid.match(/\^$/)) addReorderButtons(elt.previousSibling);
    if (tid.match(/[\*\+]/)) addDuplicateButton(elt.previousSibling);
  }

  handlers.removeFromArray = function (elt) {

    stack(elt);

    $(elt.parentNode).remove();
  }

  handlers.moveInArray = function (elt, direction) {

    stack(elt);

    elt = elt.parentNode;

    if (direction === 'up') {
      if (elt.previousSibling) {
        elt.parentNode.insertBefore(elt, elt.previousSibling);
      }
    }
    else if (elt.nextSibling) {
      elt.parentNode.insertBefore(elt.nextSibling, elt);
    }
  }

  handlers.duplicateInArray = function (elt) {

    stack(elt);

    elt = elt.parentNode;

    elt.parentNode.insertBefore(elt.cloneNode(true), elt);
  }

  //
  // render and produce, surface methods

  function root (elt) {
    var $elt = $(elt);
    if ($elt.hasClass('quad_root')) return elt;
    return $elt.parents('.quad_root')[0];
  }

  function childValue (elt, cname) {
    return $(elt).children(cname)[0].value;
  }

  function localId (elt) {
    var e = $(elt).children('.quad_id')[0];
    if ( ! e) return undefined;
    return $(e).attr('value');
  }

  function parentId (elt) {
    return elt.parentNode ? localId(elt.parentNode) : undefined;
  }

  function currentId (elt, lId) {

    var id = lId || localId(elt);

    if ( ! id) {
      if (elt.parentNode) return currentId(elt.parentNode);
      return undefined;
    }

    if (id.match(/^\./) && elt.parentNode) {
      if (id === '.0') id = '.' + computeSiblingOffset(elt, '.quad_element');
      return currentId(elt.parentNode) + id;
    }

    return id;
  }

  function toElement (x) {

    if ((typeof x) !== 'string') return x;

    if (x.match(/^#/)) x = x.slice(1);
    return document.getElementById(x);
  }

  function extractArrayId (div, template) {

    var id = template[1].id;
    if ( ! id) return undefined;

    var m = id.match(/(.+\.)([*+-])?(\^)?$/);
    if ( ! m) return undefined;

    var h = {};
    h.originalId = id;
    h.id = m[1];
    h.slicedId = m[1].slice(0, -1);
    h.canAdd = (m[2] === '*' || m[2] === '+');
    h.canRemove = (m[2] === '*' || m[2] === '-');
    h.canReorder = (m[3] === '^');

    return h;
  }

  function renderElement (container, template, data, options) {

    var func = renderers['render_' + template[0]] || renderers['render_'];

    var div = create(container, 'div', '.quad_element');

    var arrayId = extractArrayId(container, template);

    if (arrayId) {
      //
      // array

      hide(div, '.quad_id', arrayId.slicedId);
      hide(div, '.quad_type', '_array');
      hide(div, '.quad_array_template', JSON.stringify(template));

      var a = lookup(data, currentId(div));

      if (a) {
        for (var i = 0; i < a.length; i++) {

          templ = deepCopy(template);

          templ[1].id = '.0';
          var e = renderElement(div, templ, data, options);

          if (arrayId.canRemove) addRemoveButton(e);
          if (arrayId.canReorder) addReorderButtons(e);
          if (arrayId.canAdd) addDuplicateButton(e);
        }
      }
      if (arrayId.canAdd) {
        button(div, '.quad_plus_button', 'Quaderno.handlers.addToArray(this);');
      }

      return div;
    }

    // vanilla stuff, no repetition

    var id = template[1].id;

    if (id) hide(div, '.quad_id', id);

    if (template[1].title) $(div).attr('title', template[1].title);
    hide(div, '.quad_type', template[0]);

    func(div, template, data, options);

    return div;
  }

  function produceElement (container, data) {

    var type = childValue(container, '.quad_type');
    var func = renderers['produce_' + type] || renderers['produce_'];

    func(container, data);
  }

  function render (container, template, data, options) {

    container = toElement(container);

    options = options || {};
    options.translations = options.translations || {};

    container.data = data;
    container.options = options;
    container.stack = [];

    while (container.firstChild) container.removeChild(container.firstChild);

    if ((typeof template) === 'string') template = parse(template);
    renderElement(container, template, data, options);

    stack(container);
    container.original = container.stack[0].cloneNode(true);
  }

  function produce (container, data) {

    container = toElement(container);

    data = data || container.data;

    produceElement($(container).children('.quad_element')[0], data, 0);

    return data;
  }

  function undo (container) {
    container = toElement(container);
    while (container.firstChild) container.removeChild(container.firstChild);
    var tree = container.stack.pop() || container.original.cloneNode(true);
    container.appendChild(tree);
  }

  function reset (container) {
    container = toElement(container);
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(container.original.cloneNode(true));
  }

  return {

    VERSION: '1.3.1',

    // only for testing
    //
    _lookup: lookup,
    _set: set,

    // The hash of all the rendering functions, ready for insertion of new
    // render_x functions or for overriding existing render_y functions
    //
    renderers: renderers,

    // A hash for 'handlers', like for example, the showTab function.
    //
    handlers: handlers,

    parse: parse,
    render: render,
    produce: produce,

    undo: undo,
    reset: reset
  }
}();

