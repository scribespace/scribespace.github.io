import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import FolderTree, { IconComponents, testData } from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

import './css/mainView.css'

export function MainView() {
  const AddFileIcon = (..._args: any[]) => null;
  const iconComponents = {
    AddFileIcon
  } as IconComponents;
  

  const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ]
};

const formats = [
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'list', 'bullet', 'script', 'indent', 'size',
    'header', 'color', 'background', 'font', 'align'
];

  return  (
    <div className='main-view'>
      <div className='tree-view'>
        <FolderTree data={ testData } showCheckbox={ false } iconComponents={iconComponents}/>
      </div>
      <div className='editor-view'>
        <ReactQuill theme="snow"  modules={modules} formats={formats}  />
      </div>
    </div>
  )
}