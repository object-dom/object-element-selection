var ObjectElement = require('object-element');
var ObjectDocument = require('object-document');
var slice = Array.prototype.slice;

/**
 * Match the element against the selector
 * @param  {ObjectElement | Element element}
 * @param  {String selector}
 * @return {Boolean}
 */
function match(element, selector) {
  element = element.OBJECT_ELEMENT ? element.element : element;

  var matchesSelector = element.webkitMatchesSelector 
    || element.mozMatchesSelector 
    || element.oMatchesSelector 
    || element.matchesSelector;

  return matchesSelector.call(element, selector);
}

/**
 * Loop through all elements and match theme against th selector
 * @param  {Array elements}
 * @param  {String selector}
 * @return {Array elements}
 */
function matchAll(elements, selector) {
  return elements.filter(function (element, i) {
    return match(element, selector);
  });
}

/**
 * Loop through each element and return the first matched element
 * @param  {Array elements}
 * @param  {String selector}
 * @return {Element | Null}
 */
function matchFirst(elements, selector) {
  var i;

  for (i = 0; i < elements.length; i++) {
    if (match(elements[i], selector)) {
      return elements[i];
    }
  }

  return null;
}

/**
 * Loop through each element and return the last matched element
 * @param  {Array elements}
 * @param  {String selector}
 * @return {Element | Null}
 */
function matchLast(elements, selector) {
  /**
   * Clone an array of the elements reference first
   */
  return matchFirst(elements.slice().reverse(), selector);
}

/**
 * Return an array containing ELEMENT_NODE from ndoes
 * @param  {NodeList nodes}
 * @return {Array}
 */
function elementNodesOf(nodes) {
  return slice.call(nodes).map(function (node, i) {
    if (node.nodeType === 1) {
      return node;
    }
  });
}

ObjectElement.prototype.defineProperty('ancestors', {
  get: function () {
    var ancestors = [],
        parent = this.parent;

    while (parent && (parent.nodeType !== parent.DOCUMENT_NODE)) {
      ancestors.push(parent);
      parent = parent.parentNode;
    }

    return ancestors;
  }
});

ObjectElement.prototype.defineProperty('parent', {
  get: function () {
    return ObjectDocument.wrapElement(this.element.parentNode);
  }
});

ObjectElement.prototype.defineProperty('firstSibling', {
  get: function () {
    return ObjectDocument.wrapElement(this.parent).firstChild;
  }
});

ObjectElement.prototype.defineProperty('lastSibling', {
  get: function () {
    return ObjectDocument.wrapElement(this.parent).lastChild;
  }
});

ObjectElement.prototype.defineProperty('prevSibling', {
  get: function () {
    var prev;

    if ('previousElementSibling' in this.element) {
      prev = this.element.previousElementSibling;
    } else {
      prev = this.element.previousSibling;

      while (prev && prev.nodeType !== prev.ELEMENT_NODE) {
        prev = prev.previousSibling;
      }
    }

    return prev ? ObjectDocument.wrapElement(prev) : null;
  }
});

ObjectElement.prototype.defineProperty('nextSibling', {
  get: function () {
    var next;
    if ('nextElementSibling' in this.element) {
      next = this.element.nextElementSibling;
    } else {
      next = this.element.nextSibling;

      while (next && next.nodeType !== next.ELEMENT_NODE) {
        next = next.nextSibling;
      }
    }

    return next ? ObjectDocument.wrapElement(next) : null;
  }
});

ObjectElement.prototype.defineProperty('prevSiblings', {
  get: function () {
    var prevs = [];
    var prev = this.prevSibling;

    while (prev) {
      prevs.push(prev);
      prev = prev.prevSibling;
    }

    return prevs.reverse();
  }
});

ObjectElement.prototype.defineProperty('nextSiblings', {
  get: function () {
    var nexts = [];
    var next = this.nextSibling;

    while (next) {
      nexts.push(next);
      next = next.nextSibling;
    }

    return nexts;
  }
});

ObjectElement.prototype.defineProperty('siblings', {
  get: function () {
    return this.prevSiblings.concat(this.nextSiblings);
  }
});

ObjectElement.prototype.defineProperty('firstChild', {
  get: function () {
    var first;

    if ('firstElementChild' in this.element) {
      first = this.element.firstElementChild;
    } else {
      first = this.element.firstChild;

      while (first && first.nodeType !== first.ELEMENT_NODE) {
        first = first.nextSibling;
      }
    }

    return first ? ObjectDocument.wrapElement(first) : null;
  }
});

ObjectElement.prototype.defineProperty('lastChild', {
  get: function () {
    var last;

    if ('lastElementChild' in this.element) {
      last = this.element.lastElementChild;
    } else {
      last = this.element.lastChild;

      while (last && last.nodeType !== last.ELEMENT_NODE) {
        last = last.previousSibling;
      }
    }

    return last ? ObjectDocument.wrapElement(last) : null;
  }
});

/**
 * Get the fist level child elements
 * @param  {[type] element}
 * @return {[type]}
 */
ObjectElement.prototype.defineProperty('children', {
  get: function () {
    var children;

    if ('children' in this.element) {
      children = slice.call(this.element.children);
    } else {
      children = slice.call(this.element.childNodes).map(function (node, i) {
        if (node.nodeType === node.ELEMENT_NODE) {
          return node;
        }
      });
    }

    if (children.length === 0) {
      return children;
    }

    return ObjectDocument.wrapElements(children);
  }
});

/** #TODO */
ObjectElement.prototype.defineProperty('descendants', {
  get: function () {

  }
});

/**
 * Matching the element against selector
 * @param  {String selector}
 * @return {Boolean}
 */
ObjectElement.prototype.match = function (selector) {
  var matchesSelector = this.element.matchesSelector 
    || this.element.webkitMatchesSelector 
    || this.element.mozMatchesSelector 
    || this.element.oMatchesSelector;

  return matchesSelector.call(this.element, selector);
}

/** Selection methods */

ObjectElement.prototype.selectFirstSibling = function (selector) {
  
}

ObjectElement.prototype.selectLastSibling = function (selector) {
  
}

ObjectElement.prototype.selectPrevSibling = function (selector) {
  var prev = matchLast(this.prevSiblings, selector);

  if (prev === null) {
    return prev;
  }

  return ObjectDocument.wrapElement(prev);
}

ObjectElement.prototype.selectNextSibling = function (selector) {
  var next = matchFirst(this.nextSiblings, selector);

  if (next === null) {
    return next;
  }

  return ObjectDocument.wrapElement(next);
}

/**
 * Alias of .selectPrevSibling()
 */
ObjectElement.prototype.prev = ObjectElement.prototype.selectPrevSibling;

/**
 * Alias of .selectNextSibling()
 */
ObjectElement.prototype.next = ObjectElement.prototype.selectNextSibling;

ObjectElement.prototype.selectPrevSiblings = function (selector) {
  var prevs = matchAll(this.prevSiblings, selector);

  if (prevs.length === 0) {
    return prevs;
  }

  return ObjectDocument.wrapElements(prevs);
}

ObjectElement.prototype.selectNextSiblings = function (selector) {
  var nexts = matchAll(this.nextSiblings, selector);

  if (nexts.length === 0) {
    return nexts;
  }

  return ObjectDocument.wrapElements(nexts);
}

ObjectElement.prototype.selectSiblings = function (selector) {
  return this.selectPrevSiblings(selector).concat(this.selectNextSiblings(selector));
}

/**
 * Select element's child elements by selector or not
 * @param  {String selector}
 * @return {Array}
 */
ObjectElement.prototype.selectChildren = function (selector) {
  var children = this.children;

  if (children.length && selector) {
    children = matchAll(children, selector);
  }

  if (children.length === 0) {
    return children;
  }

  return ObjectDocument.wrapElements(children);
}

/**
 * Get first child element by selector or not
 * @param  {String selector}
 * @return {ObjectElement}
 */
ObjectElement.prototype.selectFirstChild = function (selector) {
  return ObjectDocument.wrapElement(matchFirst(this.children, selector));
}

/**
 * Get last child element by the selector or not
 * @param  {String selector}
 * @return {ObjectElement}
 */
ObjectElement.prototype.selectLastChild = function (selector) {
  return ObjectDocument.wrapElement(matchLast(this.children, selector));
}

/**
 * Select all elements descended from the element that match the selector
 * @param  {String selector}
 * @return {Array}
 */
ObjectElement.prototype.select = function (selector) {
  var nodeList = slice.call(this.element.querySelectorAll(selector));

  if (nodeList.length === 0) {
    return [];
  }

  return ObjectDocument.wrapElements(nodeList);
}

/**
 * Select the first element descended from the element that matchs the selector
 * @param  {String selector}
 * @return {ObjectElement | null}
 */
ObjectElement.prototype.selectFirst = function (selector) {
  var element = this.element.querySelector(selector);

  if (element === null) {
    return null;
  }

  return ObjectDocument.wrapElement(element);
}

/**
 * Select the last element descended from the element that matchs the selector
 * @param  {String selector}
 * @return {ObjectElement | null}
 */
ObjectElement.prototype.selectLast = function (selector) {
  var elements = this.select(selector);

  if (elements.length === 0) {
    return null;
  }

  return ObjectDocument.wrapElement(elements.pop());
}
