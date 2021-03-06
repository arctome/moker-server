import axios from 'axios';
import React, { useState, useImperativeHandle, useRef } from 'react'
import { toast } from 'react-toastify';
import { Button, Form, Modal } from 'semantic-ui-react'
import { collectFormData } from '../../utils'

function AdminModalCreateToken(props, ref) {
  const [open, setOpen] = useState(false)
  const [requesting, setRequesting] = useState(false)

  function show() {
    setOpen(true);
  }

  useImperativeHandle(ref, () => ({
    show
  }))

  function createTokenHandler(e) {
    e.preventDefault();
    let formVal = collectFormData(e.target);
    setRequesting(true);
    axios.post('/api/token/issue', formVal).then(res => {
      setRequesting(false);
      if (res.status === 200 && res.data.code) {
        props.showToken(res.data.data.token);
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

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      as={Form}
      onSubmit={createTokenHandler}
    >
      <Modal.Header>Create a Token</Modal.Header>
      <Modal.Content>
        <Form.Field>
          <label>Token Name</label>
          <input placeholder='Give the token a unique name' name='name' />
        </Form.Field>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Create"
          labelPosition='right'
          icon='checkmark'
          type='submit'
          positive
          loading={requesting}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default React.forwardRef(AdminModalCreateToken);