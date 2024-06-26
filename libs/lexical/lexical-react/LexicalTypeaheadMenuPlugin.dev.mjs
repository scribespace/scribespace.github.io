/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createCommand, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_UP_COMMAND, KEY_ESCAPE_COMMAND, KEY_TAB_COMMAND, KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW, $getSelection, $isRangeSelection, $isTextNode } from 'lexical';
import * as React from 'react';
import { useLayoutEffect, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { mergeRegister } from '@lexical/utils';
import { jsx } from 'react/jsx-runtime';

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
const useLayoutEffectImpl = CAN_USE_DOM ? useLayoutEffect : useEffect;

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
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
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
function getScrollParent$1(element, includeHidden) {
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
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (targetElement != null && resolution != null) {
      const rootElement = editor.getRootElement();
      const rootScrollParent = rootElement != null ? getScrollParent$1(rootElement) : document.body;
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
const SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND$1 = createCommand('SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND');
function LexicalMenu({
  close,
  editor,
  anchorElementRef,
  resolution,
  options,
  menuRenderFn,
  onSelectOption,
  shouldSplitNodeWithQuery = false,
  commandPriority = COMMAND_PRIORITY_LOW
}) {
  const [selectedIndex, setHighlightedIndex] = useState(null);
  const matchingString = resolution.match && resolution.match.matchingString;
  useEffect(() => {
    setHighlightedIndex(0);
  }, [matchingString]);
  const selectOptionAndCleanUp = useCallback(selectedEntry => {
    editor.update(() => {
      const textNodeContainingQuery = resolution.match != null && shouldSplitNodeWithQuery ? $splitNodeContainingQuery(resolution.match) : null;
      onSelectOption(selectedEntry, textNodeContainingQuery, close, resolution.match ? resolution.match.matchingString : '');
    });
  }, [editor, shouldSplitNodeWithQuery, resolution.match, onSelectOption, close]);
  const updateSelectedIndex = useCallback(index => {
    const rootElem = editor.getRootElement();
    if (rootElem !== null) {
      rootElem.setAttribute('aria-activedescendant', 'typeahead-item-' + index);
      setHighlightedIndex(index);
    }
  }, [editor]);
  useEffect(() => {
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
  useEffect(() => {
    return mergeRegister(editor.registerCommand(SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND$1, ({
      option
    }) => {
      if (option.ref && option.ref.current != null) {
        scrollIntoViewIfNeeded(option.ref.current);
        return true;
      }
      return false;
    }, commandPriority));
  }, [editor, updateSelectedIndex, commandPriority]);
  useEffect(() => {
    return mergeRegister(editor.registerCommand(KEY_ARROW_DOWN_COMMAND, payload => {
      const event = payload;
      if (options !== null && options.length && selectedIndex !== null) {
        const newSelectedIndex = selectedIndex !== options.length - 1 ? selectedIndex + 1 : 0;
        updateSelectedIndex(newSelectedIndex);
        const option = options[newSelectedIndex];
        if (option.ref != null && option.ref.current) {
          editor.dispatchCommand(SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND$1, {
            index: newSelectedIndex,
            option
          });
        }
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      return true;
    }, commandPriority), editor.registerCommand(KEY_ARROW_UP_COMMAND, payload => {
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
    }, commandPriority), editor.registerCommand(KEY_ESCAPE_COMMAND, payload => {
      const event = payload;
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
      return true;
    }, commandPriority), editor.registerCommand(KEY_TAB_COMMAND, payload => {
      const event = payload;
      if (options === null || selectedIndex === null || options[selectedIndex] == null) {
        return false;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      selectOptionAndCleanUp(options[selectedIndex]);
      return true;
    }, commandPriority), editor.registerCommand(KEY_ENTER_COMMAND, event => {
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
  const listItemProps = useMemo(() => ({
    options,
    selectOptionAndCleanUp,
    selectedIndex,
    setHighlightedIndex
  }), [selectOptionAndCleanUp, selectedIndex, options]);
  return menuRenderFn(anchorElementRef, listItemProps, resolution.match ? resolution.match.matchingString : '');
}
function useMenuAnchorRef(resolution, setResolution, className, parent = document.body) {
  const [editor] = useLexicalComposerContext();
  const anchorElementRef = useRef(document.createElement('div'));
  const positionMenu = useCallback(() => {
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
  useEffect(() => {
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
  const onVisibilityChange = useCallback(isInView => {
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

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
function getTextUpToAnchor(selection) {
  const anchor = selection.anchor;
  if (anchor.type !== 'text') {
    return null;
  }
  const anchorNode = anchor.getNode();
  if (!anchorNode.isSimpleText()) {
    return null;
  }
  const anchorOffset = anchor.offset;
  return anchorNode.getTextContent().slice(0, anchorOffset);
}
function tryToPositionRange(leadOffset, range, editorWindow) {
  const domSelection = editorWindow.getSelection();
  if (domSelection === null || !domSelection.isCollapsed) {
    return false;
  }
  const anchorNode = domSelection.anchorNode;
  const startOffset = leadOffset;
  const endOffset = domSelection.anchorOffset;
  if (anchorNode == null || endOffset == null) {
    return false;
  }
  try {
    range.setStart(anchorNode, startOffset);
    range.setEnd(anchorNode, endOffset);
  } catch (error) {
    return false;
  }
  return true;
}
function getQueryTextForSearch(editor) {
  let text = null;
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    text = getTextUpToAnchor(selection);
  });
  return text;
}
function isSelectionOnEntityBoundary(editor, offset) {
  if (offset !== 0) {
    return false;
  }
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const anchorNode = anchor.getNode();
      const prevSibling = anchorNode.getPreviousSibling();
      return $isTextNode(prevSibling) && prevSibling.isTextEntity();
    }
    return false;
  });
}
function startTransition(callback) {
  if (React.startTransition) {
    React.startTransition(callback);
  } else {
    callback();
  }
}

// Got from https://stackoverflow.com/a/42543908/2013580
function getScrollParent(element, includeHidden) {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
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
const SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND = createCommand('SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND');
function useBasicTypeaheadTriggerMatch(trigger, {
  minLength = 1,
  maxLength = 75
}) {
  return useCallback(text => {
    const validChars = '[^' + trigger + PUNCTUATION + '\\s]';
    const TypeaheadTriggerRegex = new RegExp('(^|\\s|\\()(' + '[' + trigger + ']' + '((?:' + validChars + '){0,' + maxLength + '})' + ')$');
    const match = TypeaheadTriggerRegex.exec(text);
    if (match !== null) {
      const maybeLeadingWhitespace = match[1];
      const matchingString = match[3];
      if (matchingString.length >= minLength) {
        return {
          leadOffset: match.index + maybeLeadingWhitespace.length,
          matchingString,
          replaceableString: match[2]
        };
      }
    }
    return null;
  }, [maxLength, minLength, trigger]);
}
function LexicalTypeaheadMenuPlugin({
  options,
  onQueryChange,
  onSelectOption,
  onOpen,
  onClose,
  menuRenderFn,
  triggerFn,
  anchorClassName,
  commandPriority = COMMAND_PRIORITY_LOW,
  parent
}) {
  const [editor] = useLexicalComposerContext();
  const [resolution, setResolution] = useState(null);
  const anchorElementRef = useMenuAnchorRef(resolution, setResolution, anchorClassName, parent);
  const closeTypeahead = useCallback(() => {
    setResolution(null);
    if (onClose != null && resolution !== null) {
      onClose();
    }
  }, [onClose, resolution]);
  const openTypeahead = useCallback(res => {
    setResolution(res);
    if (onOpen != null && resolution === null) {
      onOpen(res);
    }
  }, [onOpen, resolution]);
  useEffect(() => {
    const updateListener = () => {
      editor.getEditorState().read(() => {
        const editorWindow = editor._window || window;
        const range = editorWindow.document.createRange();
        const selection = $getSelection();
        const text = getQueryTextForSearch(editor);
        if (!$isRangeSelection(selection) || !selection.isCollapsed() || text === null || range === null) {
          closeTypeahead();
          return;
        }
        const match = triggerFn(text, editor);
        onQueryChange(match ? match.matchingString : null);
        if (match !== null && !isSelectionOnEntityBoundary(editor, match.leadOffset)) {
          const isRangePositioned = tryToPositionRange(match.leadOffset, range, editorWindow);
          if (isRangePositioned !== null) {
            startTransition(() => openTypeahead({
              getRect: () => range.getBoundingClientRect(),
              match
            }));
            return;
          }
        }
        closeTypeahead();
      });
    };
    const removeUpdateListener = editor.registerUpdateListener(updateListener);
    return () => {
      removeUpdateListener();
    };
  }, [editor, triggerFn, onQueryChange, resolution, closeTypeahead, openTypeahead]);
  return resolution === null || editor === null ? null : /*#__PURE__*/jsx(LexicalMenu, {
    close: closeTypeahead,
    resolution: resolution,
    editor: editor,
    anchorElementRef: anchorElementRef,
    options: options,
    menuRenderFn: menuRenderFn,
    shouldSplitNodeWithQuery: true,
    onSelectOption: onSelectOption,
    commandPriority: commandPriority
  });
}

export { LexicalTypeaheadMenuPlugin, MenuOption, PUNCTUATION, SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND, getScrollParent, useBasicTypeaheadTriggerMatch, useDynamicPositioning };
