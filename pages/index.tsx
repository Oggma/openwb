import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Home from "../components/Home";

const index = () => {
  return (
    <Layout>
      <div>
        <main>
          <Home></Home>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default index;
