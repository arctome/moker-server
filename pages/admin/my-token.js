import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Table, Button } from 'semantic-ui-react'
import Layout from '../../client/layout/Layout'
// components
import AdminModalCreateToken from '../../client/components/modals/create-token'

export default function AdminRecordsPage() {
  const [tokens, setTokens] = useState([]);
  const [listCursor, setListCursor] = useState(false);
  const createTokenRef = useRef(null);

  useEffect(() => {
    axios.get('/api/token/list').then(r => {
      if (r.status === 200 && r.data.code) {
        console.log(r)
      } else {
        toast.error("Request failed (/api/token/list)")
        console.log(r);
      }
    })
  }, [])

  function showModal() {
    createTokenRef.current.show();
  }

  return (
    <Layout>
      <div><Button icon="plus" onClick={showModal}>Create Token</Button></div>
      <div>
        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token ID</Table.HeaderCell>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Created At</Table.HeaderCell>
              <Table.HeaderCell>Operation</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              tokens.map(token => {
                return (
                  <Table.Row>
                    <Table.Cell>{token.token_id}</Table.Cell>
                    <Table.Cell>{token.name}</Table.Cell>
                    <Table.Cell>{token.c_time}</Table.Cell>
                    <Table.Cell>
                      <Button icon='trash' />
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      </div>
      <AdminModalCreateToken ref={createTokenRef} />
    </Layout>
  )
}