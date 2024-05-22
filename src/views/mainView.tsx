import TreeView from './tree/treeView';


import './css/mainView.css';

import { authGlobal, AUTH_DISABLED } from '../system/authentication';
import { FunctionComponent, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { EditorLexicalView } from '@editor/editorLexicalView';

type Props = {
  changeAuthButtonState: (state: number) => void;
};

export const MainView: FunctionComponent<Props> = ({changeAuthButtonState}) => {

  const [selectedFile, setSelectedFile] = useState<string>('');
  const { ref: toolbarRef, height: toolbarHeight = 1 } = useResizeObserver<HTMLDivElement>(); 


  const handleLogOutClick = () => {
    authGlobal.logout().then( () => { changeAuthButtonState(AUTH_DISABLED); } );
};
  return  (
    <div style={{height: '100%'}}>
      <div ref={toolbarRef} className='toolbox-view'>
        <span><button type='button' onClick={handleLogOutClick}>Log out</button></span>
      </div>
      <div style={{height: `calc(100% - ${toolbarHeight}px)`}} className='main-view'>
        <div className='tree-view'>
          <TreeView setSelectedFile={setSelectedFile}/>
        </div>
        <div className='editor-view'>
          <EditorLexicalView selectedFile={selectedFile}/>
        </div>
      </div>
    </div>
  );
};