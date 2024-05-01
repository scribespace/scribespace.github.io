import { Editor } from '@tinymce/tinymce-react';

export function EditorView() {
    return (
        <Editor
        tinymceScriptSrc='/tinymce/tinymce.min.js'
        licenseKey='gpl'
        init={{
        promotion: false,
        height: '100%',
        width: '210mm',
        resize: false,
        menubar: true,
        plugins: [
          'autolink', 'codesample', 'help', 'link', 'lists', 'pagebreak', 'searchreplace', 'table'
        ],
        toolbar: '| h1 h2 h3 | fontfamily fontsizeinput | bold italic underline strikethrough | removeformat | align | bullist numlist | forecolor |  table  | link',
        toolbar_groups: {
          align: {
            icon: 'align-left',
            tooltip: 'Align',
            items: 'alignleft aligncenter alignright alignjustify'
          }
        },
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    )
}