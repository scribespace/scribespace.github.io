/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var LexicalComposerContext = require('@lexical/react/LexicalComposerContext');
var utils = require('@lexical/utils');
var lexical = require('lexical');
var React = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    for (var k in e) {
      n[k] = e[k];
    }
  }
  n.default = e;
  return n;
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const CAN_USE_DOM = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


// This workaround is no longer necessary in React 19,
// but we currently support React >=17.x
// https://github.com/facebook/react/pull/26395
const useLayoutEffectImpl = CAN_USE_DOM ? React.useLayoutEffect : React.useEffect;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

class MenuOption {
  constructor(key) {
    this.key = key;
    this.ref = {
      current: null
    };
    this.setRefElement = this.setRefElement.bind(this);
  }
  setRefElement(element) {
    this.ref = {
      current: element
    };
  }
}
const scrollIntoViewIfNeeded = target => {
  const typeaheadContainerNode = document.getElementById('typeahead-menu');
  if (!typeaheadContainerNode) {
    return;
  }
  const typeaheadRect = typeaheadContainerNode.getBoundingClientRect();
  if (typeaheadRect.top + typeaheadRect.height > window.innerHeight) {
    typeaheadContainerNode.scrollIntoView({
      block: 'center'
    });
  }
  if (typeaheadRect.top < 0) {
    typeaheadContainerNode.scrollIntoView({
      block: 'center'
    });
  }
  target.scrollIntoView({
    block: 'nearest'
  });
};

/**
 * Walk backwards along user input and forward through entity title to try
 * and replace more of the user's text with entity.
 */
function getFullMatchOffset(documentText, entryText, offset) {
  let triggerOffset = offset;
  for (let i = triggerOffset; i <= entryText.length; i++) {
    if (documentText.substr(-i) === entryText.substr(0, i)) {
      triggerOffset = i;
    }
  }
  return triggerOffset;
}

/**
 * Split Lexical TextNode and return a new TextNode only containing matched text.
 * Common use cases include: removing the node, replacing with a new node.
 */
function $splitNodeContainingQuery(match) {
  const selection = lexical.$getSelection();
  if (!lexical.$isRangeSelection(selection) || !selection.isCollapsed()) {
    return null;
  }
  const anchor = selection.anchor;
  if (anchor.type !== 'text') {
    return null;
  }
  const anchorNode = anchor.getNode();
  if (!anchorNode.isSimpleText()) {
    return null;
  }
  const selectionOffset = anchor.offset;
  const textContent = anchorNode.getTextContent().slice(0, selectionOffset);
  const characterOffset = match.replaceableString.length;
  const queryOffset = getFullMatchOffset(textContent, match.matchingString, characterOffset);
  const startOffset = selectionOffset - queryOffset;
  if (startOffset < 0) {
    return null;
  }
  let newNode;
  if (startOffset === 0) {
    [newNode] = anchorNode.splitText(selectionOffset);
  } else {
    [, newNode] = anchorNode.splitText(startOffset, selectionOffset);
  }
  return newNode;
}

// Got from https://stackoverflow.com/a/42543908/2013580
function getScrollParent(element, includeHidden) {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = /(auto|scroll)/;
  if (style.position === 'fixed') {
    return document.body;
  }
  for (let parent = element; parent = parent.parentElement;) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }
  return document.body;
}
function isTriggerVisibleInNearestScrollContainer(targetElement, containerElement) {
  const tRect = targetElement.getBoundingClientRect();
  const cRect = containerElement.getBoundingClientRect();
  return tRect.top > cRect.top && tRect.top < cRect.bottom;
}

// Reposition the menu on scroll, window resize, and element resize.
function useDynamicPositioning(resolution, targetElement, onReposition, onVisibilityChange) {
  const [editor] = LexicalComposerContext.useLexicalComposerContext();
  React.useEffect(() => {
    if (targetElement != null && resolution != null) {
      const rootElement = editor.getRootElement();
      const rootScrollParent = rootElement != null ? getScrollParent(rootElement) : document.body;
      let ticking = false;
      let previousIsInView = isTriggerVisibleInNearestScrollContainer(targetElement, rootScrollParent);
      const handleScroll = function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            onReposition();
            ticking = false;
          });
          ticking = true;
        }
        const isInView = isTriggerVisibleInNearestScrollContainer(targetElement, rootScrollParent);
        if (isInView !== previousIsInView) {
          previousIsInView = isInView;
          if (onVisibilityChange != null) {
            onVisibilityChange(isInView);
          }
        }
      };
      const resizeObserver = new ResizeObserver(onReposition);
      window.addEventListener('resize', onReposition);
      document.addEventListener('scroll', handleScroll, {
        capture: true,
        passive: true
      });
      resizeObserver.observe(targetElement);
      return () => {
        resizeObserver.unobserve(targetElement);
        window.removeEventListener('resize', onReposition);
        document.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [targetElement, editor, onVisibilityChange, onReposition, resolution]);
}
const SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND = lexical.createCommand('SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND');
function LexicalMenu({
  close,
  editor,
  anchorElementRef,
  resolution,
  options,
  menuRenderFn,
  onSelectOption,
  shouldSplitNodeWithQuery = false,
  commandPriority = lexical.COMMAND_PRIORITY_LOW
}) {
  const [selectedIndex, setHighlightedIndex] = React.useState(null);
  const matchingString = resolution.match && resolution.match.matchingString;
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [matchingString]);
  const selectOptionAndCleanUp = React.useCallback(selectedEntry => {
    editor.update(() => {
      const textNodeContainingQuery = resolution.match != null && shouldSplitNodeWithQuery ? $splitNodeContainingQuery(resolution.match) : null;
      onSelectOption(selectedEntry, textNodeContainingQuery, close, resolution.match ? resolution.match.matchingString : '');
    });
  }, [editor, shouldSplitNodeWithQuery, resolution.match, onSelectOption, close]);
  const updateSelectedIndex = React.useCallback(index => {
    const rootElem = editor.getRootElement();
    if (rootElem !== null) {
      rootElem.setAttribute('aria-activedescendant', 'typeahead-item-' + index);
      setHighlightedIndex(index);
    }
  }, [editor]);
  React.useEffect(() => {
    return () => {
      const rootElem = editor.getRootElement();
      if (rootElem !== null) {
        rootElem.removeAttribute('aria-activedescendant');
      }
    };
  }, [editor]);
  useLayoutEffectImpl(() => {
    if (options === null) {
      setHighlightedIndex(null);
    } else if (selectedIndex === null) {
      updateSelectedIndex(0);
    }
  }, [options, selectedIndex, updateSelectedIndex]);
  React.useEffect(() => {
    return utils.mergeRegister(editor.registerCommand(SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND, ({
      option
    }) => {
      if (option.ref && option.ref.current != null) {
        scrollIntoViewIfNeeded(option.ref.current);
        return true;
      }
      return false;
    }, commandPriority));
  }, [editor, updateSelectedIndex, commandPriority]);
  React.useEffect(() => {
    return utils.mergeRegister(editor.registerCommand(lexical.KEY_ARROW_DOWN_COMMAND, payload => {
      const event = payload;
      if (options !== null && options.length && selectedIndex !== null) {
        const newSelectedIndex = selectedIndex !== options.length - 1 ? selectedIndex + 1 : 0;
        updateSelectedIndex(newSelectedIndex);
        const option = options[newSelectedIndex];
        if (option.ref != null && option.ref.current) {
          editor.dispatchCommand(SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND, {
            index: newSelectedIndex,
            option
          });
        }
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      return true;
    }, commandPriority), editor.registerCommand(lexical.KEY_ARROW_UP_COMMAND, payload => {
      const event = payload;
      if (options !== null && options.length && selectedIndex !== null) {
        const newSelectedIndex = selectedIndex !== 0 ? selectedIndex - 1 : options.length - 1;
        updateSelectedIndex(newSelectedIndex);
        const option = options[newSelectedIndex];
        if (option.ref != null && option.ref.current) {
          scrollIntoViewIfNeeded(option.ref.current);
        }
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      return true;
    }, commandPriority), editor.registerCommand(lexical.KEY_ESCAPE_COMMAND, payload => {
      const event = payload;
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
      return true;
    }, commandPriority), editor.registerCommand(lexical.KEY_TAB_COMMAND, payload => {
      const event = payload;
      if (options === null || selectedIndex === null || options[selectedIndex] == null) {
        return false;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      selectOptionAndCleanUp(options[selectedIndex]);
      return true;
    }, commandPriority), editor.registerCommand(lexical.KEY_ENTER_COMMAND, event => {
      if (options === null || selectedIndex === null || options[selectedIndex] == null) {
        return false;
      }
      if (event !== null) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      selectOptionAndCleanUp(options[selectedIndex]);
      return true;
    }, commandPriority));
  }, [selectOptionAndCleanUp, close, editor, options, selectedIndex, updateSelectedIndex, commandPriority]);
  const listItemProps = React.useMemo(() => ({
    options,
    selectOptionAndCleanUp,
    selectedIndex,
    setHighlightedIndex
  }), [selectOptionAndCleanUp, selectedIndex, options]);
  return menuRenderFn(anchorElementRef, listItemProps, resolution.match ? resolution.match.matchingString : '');
}
function useMenuAnchorRef(resolution, setResolution, className, parent = document.body) {
  const [editor] = LexicalComposerContext.useLexicalComposerContext();
  const anchorElementRef = React.useRef(document.createElement('div'));
  const positionMenu = React.useCallback(() => {
    anchorElementRef.current.style.top = anchorElementRef.current.style.bottom;
    const rootElement = editor.getRootElement();
    const containerDiv = anchorElementRef.current;
    const menuEle = containerDiv.firstChild;
    if (rootElement !== null && resolution !== null) {
      const {
        left,
        top,
        width,
        height
      } = resolution.getRect();
      const anchorHeight = anchorElementRef.current.offsetHeight; // use to position under anchor
      containerDiv.style.top = `${top + window.pageYOffset + anchorHeight + 3}px`;
      containerDiv.style.left = `${left + window.pageXOffset}px`;
      containerDiv.style.height = `${height}px`;
      containerDiv.style.width = `${width}px`;
      if (menuEle !== null) {
        menuEle.style.top = `${top}`;
        const menuRect = menuEle.getBoundingClientRect();
        const menuHeight = menuRect.height;
        const menuWidth = menuRect.width;
        const rootElementRect = rootElement.getBoundingClientRect();
        if (left + menuWidth > rootElementRect.right) {
          containerDiv.style.left = `${rootElementRect.right - menuWidth + window.pageXOffset}px`;
        }
        if ((top + menuHeight > window.innerHeight || top + menuHeight > rootElementRect.bottom) && top - rootElementRect.top > menuHeight + height) {
          containerDiv.style.top = `${top - menuHeight + window.pageYOffset - height}px`;
        }
      }
      if (!containerDiv.isConnected) {
        if (className != null) {
          containerDiv.className = className;
        }
        containerDiv.setAttribute('aria-label', 'Typeahead menu');
        containerDiv.setAttribute('id', 'typeahead-menu');
        containerDiv.setAttribute('role', 'listbox');
        containerDiv.style.display = 'block';
        containerDiv.style.position = 'absolute';
        parent.append(containerDiv);
      }
      anchorElementRef.current = containerDiv;
      rootElement.setAttribute('aria-controls', 'typeahead-menu');
    }
  }, [editor, resolution, className, parent]);
  React.useEffect(() => {
    const rootElement = editor.getRootElement();
    if (resolution !== null) {
      positionMenu();
      return () => {
        if (rootElement !== null) {
          rootElement.removeAttribute('aria-controls');
        }
        const containerDiv = anchorElementRef.current;
        if (containerDiv !== null && containerDiv.isConnected) {
          containerDiv.remove();
        }
      };
    }
  }, [editor, positionMenu, resolution]);
  const onVisibilityChange = React.useCallback(isInView => {
    if (resolution !== null) {
      if (!isInView) {
        setResolution(null);
      }
    }
  }, [resolution, setResolution]);
  useDynamicPositioning(resolution, anchorElementRef.current, positionMenu, onVisibilityChange);
  return anchorElementRef;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const PRE_PORTAL_DIV_SIZE = 1;
function LexicalContextMenuPlugin({
  options,
  onWillOpen,
  onClose,
  onOpen,
  onSelectOption,
  menuRenderFn: contextMenuRenderFn,
  anchorClassName,
  commandPriority = lexical.COMMAND_PRIORITY_LOW,
  parent
}) {
  const [editor] = LexicalComposerContext.useLexicalComposerContext();
  const [resolution, setResolution] = React.useState(null);
  const menuRef = React__namespace.useRef(null);
  const anchorElementRef = useMenuAnchorRef(resolution, setResolution, anchorClassName, parent);
  const closeNodeMenu = React.useCallback(() => {
    setResolution(null);
    if (onClose != null && resolution !== null) {
      onClose();
    }
  }, [onClose, resolution]);
  const openNodeMenu = React.useCallback(res => {
    setResolution(res);
    if (onOpen != null && resolution === null) {
      onOpen(res);
    }
  }, [onOpen, resolution]);
  const handleContextMenu = React.useCallback(event => {
    event.preventDefault();
    if (onWillOpen != null) {
      onWillOpen(event);
    }
    const zoom = utils.calculateZoomLevel(event.target);
    openNodeMenu({
      getRect: () => new DOMRect(event.clientX / zoom, event.clientY / zoom, PRE_PORTAL_DIV_SIZE, PRE_PORTAL_DIV_SIZE)
    });
  }, [openNodeMenu, onWillOpen]);
  const handleClick = React.useCallback(event => {
    if (resolution !== null && menuRef.current != null && event.target != null && !menuRef.current.contains(event.target)) {
      closeNodeMenu();
    }
  }, [closeNodeMenu, resolution]);
  React.useEffect(() => {
    const editorElement = editor.getRootElement();
    if (editorElement) {
      editorElement.addEventListener('contextmenu', handleContextMenu);
      return () => editorElement.removeEventListener('contextmenu', handleContextMenu);
    }
  }, [editor, handleContextMenu]);
  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [editor, handleClick]);
  return resolution === null || editor === null ? null : /*#__PURE__*/jsxRuntime.jsx(LexicalMenu, {
    close: closeNodeMenu,
    resolution: resolution,
    editor: editor,
    anchorElementRef: anchorElementRef,
    options: options,
    menuRenderFn: (anchorRef, itemProps) => contextMenuRenderFn(anchorRef, itemProps, {
      setMenuRef: ref => {
        menuRef.current = ref;
      }
    }),
    onSelectOption: onSelectOption,
    commandPriority: commandPriority
  });
}

exports.LexicalContextMenuPlugin = LexicalContextMenuPlugin;
exports.MenuOption = MenuOption;
