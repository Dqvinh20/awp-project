import { forwardRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { Space } from 'antd';

const CustomToolbar = ({ visibity = false }: { visibity: boolean }) => (
  <div
    id="toolbar"
    className={`${visibity ? 'w-full ql-toolbar ql-snow' : 'hidden'}`}
  >
    <Space>
      <div>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>
      </div>
      <button className="ql-link"></button>
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
    </Space>
  </div>
);

export type QuillEditorRefType = ReactQuill;

interface QuillEditorProps {
  onChange: (value: string) => void;
}

function QuillEditor({ onChange }: QuillEditorProps, ref: any) {
  const [editorState, setEditorState] = useState({
    value: '',
    isFocused: false,
  });

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  const customToolbar = {
    toolbar: {
      container: '#toolbar',
    },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  return (
    <div
      className={`!w-full flex-1 bg-white rounded-3xl [&_*]:!border-none border-solid ${
        editorState.isFocused
          ? ' !border-2 !border-green-500'
          : 'border border-gray-300'
      }`}
    >
      <ReactQuill
        ref={ref}
        className="w-full max-w-full"
        theme={'snow'}
        modules={customToolbar}
        formats={formats}
        defaultValue={editorState.value}
        value={editorState.value}
        onChange={(current_value) => {
          setEditorState({
            ...editorState,
            value: current_value,
          });
          onChange(current_value);
        }}
        onFocus={() => {
          setEditorState((prev) => ({
            ...prev,
            isFocused: ref?.current?.getEditor().hasFocus() ?? false,
          }));
        }}
        onBlur={() => {
          setEditorState((prev) => ({
            ...prev,
            isFocused: ref?.current?.getEditor().hasFocus() ?? false,
          }));
        }}
        placeholder="Write your comment here..."
      />
      <CustomToolbar visibity={editorState.isFocused} />
    </div>
  );
}

export default forwardRef<ReactQuill, QuillEditorProps>(QuillEditor);
