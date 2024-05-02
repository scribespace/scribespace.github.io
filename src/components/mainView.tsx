import { TreeView } from './treeView';

import { EditorView } from './editorView';

import './css/mainView.css'

import { authGlobal, AUTH_DISABLED } from '../system/authentication';
import { FunctionComponent, useState } from 'react';

type Props = {
  changeAuthButtonState: (state: number) => void;
}

export const MainView: FunctionComponent<Props> = ({changeAuthButtonState}) => {

  const [selectedFile, setSelectedFile] = useState<string>('');

  const handleLogOutClick = () => {
    authGlobal.logout().then( () => { changeAuthButtonState(AUTH_DISABLED) } );
};

  return  (
    <div style={{height: '100%'}}>
      <div className='toolbox-view'>
        <span><button type='button' onClick={handleLogOutClick}>Log out</button></span>
      </div>
      <div className='main-view'>
        <div className='tree-view'>
          <TreeView setSelectedFile={setSelectedFile}/>
        </div>
        <div className='editor-view'>
          <EditorView selectedFile={selectedFile}/>
        </div>
      </div>
    </div>
  )
}