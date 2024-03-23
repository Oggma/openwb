import React from "react";
import Layout from "../components/Layout";
import WhiteBoard from "../components/WhiteBoard";

type Props = {
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
