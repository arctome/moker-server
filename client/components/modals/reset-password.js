import axios from 'axios';
import React, { useState, useImperativeHandle } from 'react'
import { toast } from 'react-toastify';
import { Button, Form, Modal } from 'semantic-ui-react'
import { collectFormData } from '../../utils'

function ResetPasswordModal(props, ref) {
  const userid = props.userid
  const [open, setOpen] = useState(false)
  const [requesting, setRequesting] = useState(false)

  function show() {
    setOpen(true);
  }

  useImperativeHandle(ref, () => ({
    show
  }))

  function resetHandler(e) {
    e.preventDefault();
    let formVal = collectFormData(e.target);
    if(formVal.password !== formVal.repeat_password) {
      toast.error("Password mismatch");
      return;
    }
    setRequesting(true);
    axios.post('/api/user/reset-password', {...formVal, user_id: userid}).then(res => {
      setRequesting(false);
      if (res.status === 200 && res.data.code) {
        toast.success("Password reset successfully, redirecting to login page")
        setOpen(false);
        setTimeout(() => {
          window.location.href = '/api/user/logout'
        }, 500)
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
      onSubmit={resetHandler}
    >
      <Modal.Header>Reset Password</Modal.Header>
      <Modal.Content>
        <Form.Field>
          <label>Old Password</label>
          <input name='old_password' type="password" />
        </Form.Field>
        <Form.Field>
          <label>New Password</label>
          <input name='password' type="password" />
        </Form.Field>
        <Form.Field>
          <label>Repeat Password</label>
          <input name='repeat_password' type="password" />
        </Form.Field>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Submit"
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

export default React.forwardRef(ResetPasswordModal);