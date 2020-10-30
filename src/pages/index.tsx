import { GetStaticProps } from "next"
import Head from 'next/head'

export default function Home({title, description}) {
  return (
    <>
      <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta charSet="utf-8" />
          <meta name="Description" content={description}></meta>
          <title>{ title }</title>
      </Head>
      <div>Hello world</div>
    </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
  const siteData = await import(`../../config.json`)

  return {
    props: {
      title: siteData.default.title,
      description: siteData.default.description,
    }
  }
}