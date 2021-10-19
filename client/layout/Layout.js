import React from 'react'
import {
  Container,
  Dropdown,
  Image,
  Menu,
} from 'semantic-ui-react'
import Link from "flareact/link";

function logoutHandler() {
  window.location.href = '/api/user/logout';
}

const FixedMenuLayout = (props) => (
  <div>
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
          MOKER
        </Menu.Item>
        <Dropdown item simple text='Library'>
          <Dropdown.Menu>
            <Dropdown.Item>Records</Dropdown.Item>
            <Dropdown.Item>Collections</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item>
          Document
        </Menu.Item>
        <Menu.Menu position='right'>
          <Dropdown item simple text='Hello, abcdefg'>
            <Dropdown.Menu>
              <Dropdown.Item onClick={logoutHandler} as="a">Logout</Dropdown.Item>
              <Dropdown.Item as="a" href="/admin/my-token">My Token</Dropdown.Item>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Admin Panel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Container>
    </Menu>

    <Container text style={{ marginTop: '7em' }}>
      {props.children}
    </Container>
  </div>
)

export default FixedMenuLayout