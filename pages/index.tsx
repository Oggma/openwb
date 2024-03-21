import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import WhiteBoard from "../components/WhiteBoard";
import prisma from "../lib/prisma";

// export const getStaticProps: GetStaticProps = async () => {
//   const feed = await prisma.post.findMany({
//     where: { published: true },
//     include: {
//       author: {
//         select: {
//           name: true,
//         },
//       },
//     },
//   });
  
//   return {
//     props: { feed },
//     revalidate: 10,
//   };
// };

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <main>
          <div><WhiteBoard></WhiteBoard></div>
        </main>
      </div>
      <style jsx>{`
        
      `}</style>
    </Layout>
  );
};

export default Blog;
