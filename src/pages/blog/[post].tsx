import matter from "gray-matter";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown, { ChildrenProp } from 'react-markdown'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const CodeBlock = (code) => {
  const { language, value } = code
  return (
    <SyntaxHighlighter showLineNumbers={true} language={language}>
      {value}
    </SyntaxHighlighter>
  );
};

const ImageRenderer = (data, maxWidth) => {
  const {
    alt,
    src,
    title,
  }: {
    alt?: string;
    src?: string;
    title?: string;
  } = data
  return (
    <div style={{display: "flex", width: "100%", justifyContent: "center"}}>
      <img 
        alt={alt} 
        src={`../images/${src}`} 
        title={title} 
        style={{ maxWidth, maxHeight: "50vh" }}  
      />
    </div>
  
)}

const useResize = (myRef: React.RefObject<HTMLDivElement>) => {
  const getWidth = useCallback(() => myRef?.current?.offsetWidth, [myRef]);

  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
      const handleResize = () => {
          setWidth(getWidth());
      };

      if (myRef.current) {
          setWidth(getWidth());
      }

      window.addEventListener('resize', handleResize);

      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, [myRef, getWidth]);

  return width && width > 25 ? width - 25 : width;
};

type CustomMarkdownProps = {
  maxWidth?: number;
  content?: string
}
const CustomMarkdown = ({ maxWidth, content }: CustomMarkdownProps) => {

  return (
    <ReactMarkdown 
      escapeHtml={true} 
      renderers={{ code: CodeBlock, image: (data) => ImageRenderer(data, maxWidth) }}
    >
      {content}
    </ReactMarkdown>
  )
}

const Blog = ({content, data}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const maxWidth = useResize(divRef);
  const frontmatter = data;


  return (
    <div ref={divRef} style={{border: "5px red solid", width: "80%"}}>
      <h1>{frontmatter.title}</h1>
      <h3>{frontmatter.description}</h3>
   
      <CustomMarkdown 
        maxWidth={maxWidth}
        content={content}
      />
    </div>
  );
};

export default Blog;

Blog.getInitialProps = async (context) => {
  const { post } = context.query;

  const content = await import(`../../../content/${post}.md`);
  const data = matter(content.default);

  return { ...data };
};