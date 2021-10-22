import axios from 'axios';
import React, { useState, useImperativeHandle } from 'react'
import { toast } from 'react-toastify';
import { Button, Form, Modal, Dropdown } from 'semantic-ui-react'
import { collectFormData } from '../../utils'

function CreateRecordModal(props, ref) {
  const createCasesHandler = props.createCasesHandler
  const [open, setOpen] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [collections, setCollections] = useState([])
  const [currentCollections, setCurrentCollections] = useState([])

  function show() {
    setOpen(true);
  }

  useImperativeHandle(ref, () => ({
    show
  }))

  function createRecordHandler(e) {
    e.preventDefault();
    let formVal = collectFormData(e.target);
    formVal.collections = currentCollections;
    if (!formVal.name || !formVal.url || !formVal.collections) {
      toast.error("All fields are required")
      return;
    }
    setRequesting(true);
    axios.post('/api/record/create', formVal).then(res => {
      setRequesting(false);
      if (res.status === 200 && res.data.code) {
        toast.success("Create Successfully");
        createCasesHandler(res.data.data.record_id);
        setTimeout(() => {
          setOpen(false);
        }, 16)
      } else {
        toast.error("Request failed (" + (res.data.msg || "Unknown Message") + ")")
        return;
      }
    }).catch(err => {
      toast.error("Axios error (" + err.message + ")")
      return;
    })
  }

  // Dropdown
  function handleAddition(e, data) {
    let newArr = collections.slice()
    newArr.push({text: data.value, key: data.value, value: data.value})
    setCollections(newArr)
  }
  function handleChange(e, data) {
    setCurrentCollections(data.value)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      as={Form}
      onSubmit={createRecordHandler}
    >
      <Modal.Header>Create Record</Modal.Header>
      <Modal.Content>
        <Form.Field>
          <label>Name</label>
          <input placeholder='A unique ID' name='name' />
        </Form.Field>
        <Form.Field>
          <label>URL</label>
          <input placeholder='A unique name' name='url' />
        </Form.Field>
        <Form.Field>
          <label>Collections</label>
          <Dropdown
            options={collections}
            placeholder='Choose Collections'
            search
            selection
            fluid
            multiple
            allowAdditions
            value={currentCollections}
            onAddItem={handleAddition}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          {/* <Checkbox label='Only me visible?' name='private_read' /> */}
          <label>Private Read</label>
          <input type="checkbox" name="private_read" />
        </Form.Field>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Next"
          labelPosition='right'
          icon='angle right'
          type='submit'
          positive
          loading={requesting}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default React.forwardRef(CreateRecordModal);