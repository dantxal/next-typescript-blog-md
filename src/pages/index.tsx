import { GetStaticProps } from "next";
import Head from 'next/head';
import Link from 'next/link';
import matter from 'gray-matter';

export default function Home({title, description, data}) {
  const realData = data.map((blog) => matter(blog));
  const listItems = realData.map((item) => item.data)

  return (
    <>
      <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta charSet="utf-8" />
          <meta name="Description" content={description}></meta>
          <title>{ title }</title>
      </Head>
      <div>Hello world</div>

      <ul>
        {listItems.map(( blog, i ) => (
          <li key={i}>
            <Link href={`blog/${blog.slug}`} >
              {blog.title}
            </Link>
            <p>{blog.description}</p>
          </li>
        ))}
      </ul>
    </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
  const siteData = await import(`../../config.json`)
  const fs = require('fs');

  const files = fs.readdirSync(`${process.cwd()}/content`, "utf-8");
  const blogs = files.filter((filename) => filename.endsWith(".md"))

  const data = blogs.map((postFile) => {
    const path = `${process.cwd()}/content/${postFile}`
    const rawContent = fs.readFileSync(path, {
      encoding: "utf-8",
    })

    return rawContent
  });

  return {
    props: {
      title: siteData.default.title,
      description: siteData.default.description,
      data,
    }
  }
}