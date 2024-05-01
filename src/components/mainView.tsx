import { TreeView } from './treeView';

import { EditorView } from './editorView';

import './css/mainView.css'

export function MainView() {

  return  (
    <div className='main-view'>
      <div className='tree-view'>
        <TreeView/>
      </div>
      <div className='editor-view'>
        <EditorView/>
      </div>
    </div>
  )
}