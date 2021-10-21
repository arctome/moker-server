import React, { useEffect } from 'react';
import {
  Container,
  Dropdown,
  Image,
  Menu,
} from 'semantic-ui-react'
import { useStore } from '../state-persistence/index'
import axios from 'axios'
import { toast } from 'react-toastify'

function logoutHandler() {
  window.location.href = '/api/user/logout';
}

function FixedMenuLayout(props) {
  const [state, dispatch] = useStore()

  useEffect(() => {
    if (!state.user) {
      axios.get('/api/user/info').then(res => {
        if (res.status === 200 && res.data.code) {
          dispatch({ type: 'login', data: res.data.data })
        } else {
          toast.error('Fetch user info failed (' + (res.data.msg || 'Unknown Error') + ')')
        }
      }).catch(e => {
        toast.error('Fetch user info failed (' + e.message + ')')
      })
    }
  }, [])

  return (
    <div>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item as='a' href="/admin" header>
            <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
            MOKER
          </Menu.Item>
          <Dropdown item simple text='Library'>
            <Dropdown.Menu>
              <Dropdown.Item as="a" href="/admin/records">Records</Dropdown.Item>
              <Dropdown.Item as="a" href="/admin/collections">Collections</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item>
            Document
          </Menu.Item>
          <Menu.Menu position='right'>
            <Dropdown item simple text={state.user ? ('Hello, ' + state.user.username) : ''}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logoutHandler} as="a">Logout</Dropdown.Item>
                <Dropdown.Item as="a" href="/admin/my-token">My Token</Dropdown.Item>
                <Dropdown.Item as="a" href="/admin/my-profile">Profile</Dropdown.Item>
                {state.user && state.user.user_id === 'admin' ? <Dropdown.Divider /> : ''}
                {state.user && state.user.user_id === 'admin' ? <Dropdown.Item as="a" href="/admin/admin-panel">Admin Panel</Dropdown.Item> : ''}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Container>
      </Menu>

      <Container style={{ marginTop: '7em' }}>
        {props.children}
      </Container>
    </div>
  )
}

export default FixedMenuLayout