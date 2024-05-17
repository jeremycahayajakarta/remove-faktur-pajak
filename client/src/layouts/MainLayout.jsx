import React from "react";
import { TagOutlined, FileTextOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Table, Typography, theme } from "antd";
const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  const items = [
    getItem("DMS", "dms", <FileTextOutlined />, [
      getItem("Document Management", "3"),
      getItem("Konfigurasi", "4"),
      getItem("Admin Menu QMS", "5"),
    ]),
    getItem("Faktur Pajak", "fp", <TagOutlined />),
  ];
  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
            overflow: "auto",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={items}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Title level={4}>Faktur</Title>
          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "initial",
            }}
          >
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
              
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
