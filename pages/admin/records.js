import Layout from '../../client/layout/Layout'
import { Dimmer, Loader, Table, Button } from 'semantic-ui-react'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import CreateRecord from '../../client/components/modals/create-record'
import CreateCases from '../../client/components/modals/create-cases'
import { copyToClipboard } from '../../client/utils'
import RecordDetail from '../../client/components/info-modals/record-detail'

export default function AdminRecordsPage() {
  const [records, setRecords] = useState([])
  const [requesting, setRequesting] = useState(false)
  const createRecordRef = useRef(null)
  const createCasesRef = useRef(null)
  const recordDetailRef = useRef(null)

  useEffect(() => {
    setRequesting(true)
    axios.get('/api/record/list').then(res => {
      setRequesting(false)
      if (res.status === 200 && res.data.code) {
        setRecords(res.data.data)
      } else {
        toast.error("Request failed (" + (res.data.msg || "Unknown Message") + ")")
      }
    }).catch(err => {
      toast.error("Axios error (" + err.message + ")")
      return;
    })
  }, [])

  function createHandler() {
    createRecordRef.current.show()
  }
  function createCasesHandler(record_id) {
    createCasesRef.current.show(record_id)
  }

  function copyMockID(id) {
    toast.success("Mock ID has been copied to clipboard")
    copyToClipboard(id)
  }

  return (
    <Layout>
      <div style={{ marginBottom: '10px' }}>
        <Button icon="plus" onClick={createHandler}>Create Record</Button>
        {/* <Button icon="plus" onClick={createCasesHandler}>Debugger Create Case</Button> */}
      </div>
      <Table striped compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">Mock ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Creator's ID</Table.HeaderCell>
            {/* <Table.HeaderCell>Collections</Table.HeaderCell> */}
            <Table.HeaderCell textAlign="center">Operation</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {requesting ?
          <Dimmer active={requesting}><Loader /></Dimmer> :
          <Table.Body>
            {records.map(record => {
              return (
                <Table.Row>
                  <Table.Cell style={{ cursor: 'pointer' }} textAlign="center" selectable width={3} onClick={() => { copyMockID(record.record_id) }}>{record.record_id}</Table.Cell>
                  <Table.Cell>{record.name}</Table.Cell>
                  <Table.Cell>{dayjs(record.c_time).format('YYYY/MM/DD HH:mm:ss')}</Table.Cell>
                  <Table.Cell textAlign="center">{record.owner_id}</Table.Cell>
                  {/* <Table.Cell>{record.collections}</Table.Cell> */}
                  <Table.Cell style={{ cursor: 'pointer' }} textAlign="center" selectable onClick={() => { recordDetailRef.current.show(record) }}>Detail</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        }
      </Table>
      <CreateRecord ref={createRecordRef} createCasesHandler={createCasesHandler} />
      <CreateCases ref={createCasesRef} />
      <RecordDetail ref={recordDetailRef} />
    </Layout>
  )
}