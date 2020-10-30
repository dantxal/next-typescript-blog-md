import matter from "gray-matter";
import { useRef } from "react";
import MarkdownRenderer from '../../components/MarkdownRenderer'
import getWidth from '../../utils/getWidthFromRef'



const Blog = ({content, data}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const maxWidth = getWidth(divRef);
  const frontMatter = data;

  return (
    <div ref={divRef} style={{border: "5px red solid", width: "80%"}}>
      <h1>{frontMatter.title}</h1>
      <h3>{frontMatter.description}</h3>
   
      <MarkdownRenderer 
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