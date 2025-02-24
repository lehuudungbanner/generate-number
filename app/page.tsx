import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Main from "./pages/Main";
export default function Home() {
  // const {
  //   token: { colorBgContainer, borderRadiusLG },
  // } = theme.useToken();
  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div style={{ color: "white", fontSize: "20px" }}>Tạo số tài khoản</div>
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <div
          style={{
            background: "white",
            minHeight: 280,
            padding: 24,
            borderRadius: "14px",
            marginTop: "30px",
          }}
        >
          <Main />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Design ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}
