/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { LexicalComposerContext, createLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRef, useContext, useMemo, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function getTransformSetFromKlass(klass) {
  const transform = klass.transform();
  return transform !== null ? new Set([transform]) : new Set();
}
function LexicalNestedComposer({
  initialEditor,
  children,
  initialNodes,
  initialTheme,
  skipCollabChecks
}) {
  const wasCollabPreviouslyReadyRef = useRef(false);
  const parentContext = useContext(LexicalComposerContext);
  if (parentContext == null) {
    {
      throw Error(`Unexpected parent context null on a nested composer`);
    }
  }
  const [parentEditor, {
    getTheme: getParentTheme
  }] = parentContext;
  const composerContext = useMemo(() => {
    const composerTheme = initialTheme || getParentTheme() || undefined;
    const context = createLexicalComposerContext(parentContext, composerTheme);
    if (composerTheme !== undefined) {
      initialEditor._config.theme = composerTheme;
    }
    initialEditor._parentEditor = parentEditor;
    if (!initialNodes) {
      const parentNodes = initialEditor._nodes = new Map(parentEditor._nodes);
      for (const [type, entry] of parentNodes) {
        initialEditor._nodes.set(type, {
          exportDOM: entry.exportDOM,
          klass: entry.klass,
          replace: entry.replace,
          replaceWithKlass: entry.replaceWithKlass,
          transforms: getTransformSetFromKlass(entry.klass)
        });
      }
    } else {
      for (let klass of initialNodes) {
        let replace = null;
        let replaceWithKlass = null;
        if (typeof klass !== 'function') {
          const options = klass;
          klass = options.replace;
          replace = options.with;
          replaceWithKlass = options.withKlass || null;
        }
        const registeredKlass = initialEditor._nodes.get(klass.getType());
        initialEditor._nodes.set(klass.getType(), {
          exportDOM: registeredKlass ? registeredKlass.exportDOM : undefined,
          klass,
          replace,
          replaceWithKlass,
          transforms: getTransformSetFromKlass(klass)
        });
      }
    }
    initialEditor._config.namespace = parentEditor._config.namespace;
    initialEditor._editable = parentEditor._editable;
    return [initialEditor, context];
  },
  // We only do this for init
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  // If collaboration is enabled, make sure we don't render the children until the collaboration subdocument is ready.
  const {
    isCollabActive,
    yjsDocMap
  } = useCollaborationContext();
  const isCollabReady = skipCollabChecks || wasCollabPreviouslyReadyRef.current || yjsDocMap.has(initialEditor.getKey());
  useEffect(() => {
    if (isCollabReady) {
      wasCollabPreviouslyReadyRef.current = true;
    }
  }, [isCollabReady]);

  // Update `isEditable` state of nested editor in response to the same change on parent editor.
  useEffect(() => {
    return parentEditor.registerEditableListener(editable => {
      initialEditor.setEditable(editable);
    });
  }, [initialEditor, parentEditor]);
  return /*#__PURE__*/jsx(LexicalComposerContext.Provider, {
    value: composerContext,
    children: !isCollabActive || isCollabReady ? children : null
  });
}

export { LexicalNestedComposer };
