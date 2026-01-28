import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useChatStore } from '@/context/useChatStore';
import { assets } from '@/assets/assets';
import './RichTextEditor.css';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-menu-bar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        type="button"
        title="加粗"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        type="button"
        title="斜体"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
        type="button"
        title="删除线"
      >
        <s>S</s>
      </button>
      <div className="divider" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        type="button"
        title="标题1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        type="button"
        title="标题2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        type="button"
        title="标题3"
      >
        H3
      </button>
      <div className="divider" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        type="button"
        title="无序列表"
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        type="button"
        title="有序列表"
      >
        1. List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
        type="button"
        title="引用"
      >
        "Quote"
      </button>
      <div className="divider" />
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
        type="button"
        title="代码块"
      >
        {'</>'}
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        type="button"
        title="分割线"
      >
        ―
      </button>
    </div>
  );
};

const RichTextEditor = ({ onSubmit, placeholder = '在这里输入提示...' }) => {
  const { input, setInput, handleKeyPress, onSent } = useChatStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: input,
    onUpdate: ({ editor }) => {
      // 将 HTML 转换回纯文本或保留 HTML
      const html = editor.getHTML();
      const text = editor.getText();
      // 根据需要选择使用 text 或 html
      setInput(text);
    },
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
  });

  const handleSubmit = () => {
    if (!editor || editor.isEmpty) return;
    const content = editor.getText().trim();
    if (content) {
      onSent(content);
      editor.commands.clearContent();
    }
  };

  return (
    <div className="rich-text-editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="editor-footer">
        <div className="flex gap-3">
          <img src={assets.gallery_icon} alt="图片" className="editor-icon" />
          <img
            src={assets.mic_icon}
            alt="语音"
            className="editor-icon"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="send-btn"
          type="button"
          disabled={!editor || editor.isEmpty}
        >
          <img src={assets.send_icon} alt="发送" />
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;

