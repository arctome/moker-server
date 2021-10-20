import axios from 'axios';
import React, { useState, useImperativeHandle } from 'react'
import { toast } from 'react-toastify';
import { Button, Form, Modal } from 'semantic-ui-react'
import { collectFormData } from '../../utils'

function AdminModalCreateUser(props, ref) {
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
    if(!formVal.user_id || !formVal.username || !formVal.password) {
      toast.error("All fields are required")
      return;
    }
    if(formVal.password !== formVal.repeat_password) {
      toast.error("Passwords mismatch, please check")
      return;
    }
    setRequesting(true);
    axios.post('/api/admin/user/create', formVal).then(res => {
      setRequesting(false);
      if (res.status === 200 && res.data.code) {
        toast.success("Create Successfully");
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
      <Modal.Header>Create User</Modal.Header>
      <Modal.Content>
        <Form.Field>
          <label>User ID</label>
          <input placeholder='A unique ID' name='user_id' />
        </Form.Field>
        <Form.Field>
          <label>User Name</label>
          <input placeholder='A unique name' name='username' />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input name='password' type='password' />
        </Form.Field>
        <Form.Field>
          <label>Repeat Password</label>
          <input name='repeat_password' type='password' />
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

export default React.forwardRef(AdminModalCreateUser);