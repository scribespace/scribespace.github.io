import TreeView from './tree/treeView';


import './css/mainView.css';

import { EditorView } from '@/views/editor/editorView';
import useBoundingRect from '@/hooks/useBoundingRect';
import { FunctionComponent, useRef, useState } from 'react';
import { AUTH_DISABLED, authGlobal } from '../system/authentication';

type Props = {
  changeAuthButtonState: (state: number) => void;
};

export const MainView: FunctionComponent<Props> = ({changeAuthButtonState}) => {

  const [selectedFile, setSelectedFile] = useState<string>('');
  const toolbarRef = useRef<HTMLDivElement>(null);
  const {height: toolbarHeight } = useBoundingRect(toolbarRef);

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
          <EditorView selectedFile={selectedFile}/>
        </div>
      </div>
    </div>
  );
};