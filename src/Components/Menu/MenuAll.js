import React from 'react';
import { DownOutlined, UserOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip } from 'antd';
const handleButtonClick = (e) => {
  message.info('Click on left button.');
  console.log('click left button', e);
};
const handleMenuClick = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};
const items = [
  {
    label: '1st menu item',
    key: '1',
    icon: <UserOutlined />,
  },
  {
    label: '2nd menu item',
    key: '2',
    icon: <UserOutlined />,
  },
  {
    label: '3rd menu item',
    key: '3',
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: '4rd menu item',
    key: '4',
    icon: <UserOutlined />,
    danger: true,
    disabled: true,
  },
];
const menuProps = {
  items,
  onClick: handleMenuClick,
};
const MenuAll = () => (
  <Space wrap style={{ padding: '10px', marginLeft : '110px'}}>
    <Dropdown menu={menuProps}>
      <Button>
        <Space style={{fontSize: '32px', padding: '10px'}}>
          <MenuUnfoldOutlined />
          Danh mục
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  </Space>
);
export default MenuAll;