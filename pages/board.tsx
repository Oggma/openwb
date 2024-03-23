import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import WhiteBoard from "../components/WhiteBoard";

const board = () => {
  return (
    <Layout>
      <WhiteBoard></WhiteBoard>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default board;
