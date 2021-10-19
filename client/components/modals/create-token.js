import axios from 'axios';
import React, { useState, useImperativeHandle } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import { collectFormData } from '../../utils'

function AdminModalCreateToken(props, ref) {
  const [open, setOpen] = useState(false)

  function show() {
    setOpen(true);
  }

  useImperativeHandle(ref, () => ({
    show
  }))

  function createTokenHandler(e) {
    e.preventDefault();
    let formVal = collectFormData(e.target);
    axios.post('/api/token/issue', formVal).then(res => {
      console.log(res);
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
          content="Create !"
          labelPosition='right'
          icon='checkmark'
          type='submit'
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default React.forwardRef(AdminModalCreateToken);