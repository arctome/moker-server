import { useEffect, useRef, useState } from 'react'
import Layout from '../../client/layout/Layout'
import axios from 'axios'
import { Dimmer, Loader, Table, Button } from 'semantic-ui-react'
import DeleteUserConfirm from '../../client/components/modals/delete-user-confirm'
import CreateUser from '../../client/components/modals/create-user'

export default function AdminRecordsPage() {
  const [users, setUsers] = useState([]);
  const [requesting, setRequesting] = useState(false)
  const createUserRef = useRef(null)

  useEffect(() => {
    setRequesting(true)
    axios.get('/api/admin/user/list').then(res => {
      setRequesting(false);
      if (res.status === 200 && res.data.code) {
        console.log(res.data)
      } else {
        toast.error("Request failed (" + (res.data.msg || "Unknown Message") + ")")
        return;
      }
    }).catch(err => {
      toast.error("Axios error (" + err.message + ")")
      return;
    })
  }, [])

  function createHandler() {
    createUserRef.current.show()
  }

  return (
    <Layout>
      <div style={{ marginBottom: '10px' }}><Button icon="plus" onClick={createHandler}>Create New User</Button></div>
      <Dimmer active={requesting}>
        <Loader>Loading</Loader>
      </Dimmer>
      {
        !requesting ? <div>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>User ID</Table.HeaderCell>
                <Table.HeaderCell>User Name</Table.HeaderCell>
                <Table.HeaderCell>Operation</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                users.map(user => {
                  return (
                    <Table.Row key={user.user_id}>
                      <Table.Cell>{user.user_id}</Table.Cell>
                      <Table.Cell>{user.name}</Table.Cell>
                      <Table.Cell>
                        <DeleteUserConfirm trigger={<Button icon='trash' />} userid={user.user_id} />
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
          </Table>
        </div> : ''
      }
      <CreateUser ref={createUserRef} />
    </Layout>
  )
}