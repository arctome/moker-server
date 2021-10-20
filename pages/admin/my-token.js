import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Table, Button, Dimmer, Loader } from 'semantic-ui-react'
import Layout from '../../client/layout/Layout'
// components
import AdminModalCreateToken from '../../client/components/modals/create-token'
import dayjs from 'dayjs';
import DeleteConfirmModal from '../../client/components/modals/delete-token-confirm';
import ShowToken from '../../client/components/modals/show-token';

export default function AdminRecordsPage() {
  const [tokens, setTokens] = useState([]);
  const [requesting, setRequesting] = useState(false)
  // const [listCursor, setListCursor] = useState(false);
  const createTokenRef = useRef(null);
  const showTokenRef = useRef(null)

  useEffect(() => {
    setRequesting(true);
    axios.get('/api/token/list').then(r => {
      setRequesting(false);
      if (r.status === 200 && r.data.code) {
        setTokens(r.data.data)
      } else {
        toast.error("Request failed (/api/token/list)")
        console.log(r);
      }
    })
  }, [])

  function showModal() {
    createTokenRef.current.show();
  }
  function showTokenHandler(token) {
    showTokenRef.current.show(token);
  }

  return (
    <Layout>
      <div style={{marginBottom: '10px'}}><Button icon="plus" onClick={showModal}>Create Token</Button></div>
      <Dimmer active={requesting}>
        <Loader>Loading</Loader>
      </Dimmer>
      {
        !requesting ? <div>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                {/* <Table.HeaderCell>Token ID</Table.HeaderCell> */}
                <Table.HeaderCell>Token Name</Table.HeaderCell>
                <Table.HeaderCell>Created At</Table.HeaderCell>
                <Table.HeaderCell>Operation</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                tokens.map(token => {
                  return (
                    <Table.Row key={token.token_id}>
                      {/* <Table.Cell>{token.token_id}</Table.Cell> */}
                      <Table.Cell>{token.name}</Table.Cell>
                      <Table.Cell>{dayjs(token.c_time).format('YYYY/MM/DD HH:mm:ss')}</Table.Cell>
                      <Table.Cell>
                        <DeleteConfirmModal trigger={<Button icon='trash' />} tokenid={token.token_id} />
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
          </Table>
        </div> : ''
      }
      <AdminModalCreateToken ref={createTokenRef} showToken={showTokenHandler} />
      <ShowToken ref={showTokenRef} />
    </Layout>
  )
}