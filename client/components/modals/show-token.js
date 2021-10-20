import React, { useState, useImperativeHandle } from 'react'
import { Button, Form, Modal, TextArea } from 'semantic-ui-react'
import { copyToClipboard } from '../../utils';
import { toast } from 'react-toastify'

function AdminModalShowToken(props, ref) {
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState("")

  function show(token) {
    setOpen(true);
    setToken(token)
  }

  useImperativeHandle(ref, () => ({
    show
  }))

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>Copy Token</Modal.Header>
      <Modal.Content>
        <Form>
          <TextArea rows={2} value={token} readonly onClick={() => {
            copyToClipboard(token);
            toast.success("Token has been copied to clipboard")
          }} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="OK"
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            setOpen(false);
            setTimeout(() => {
              window.location.reload();
            }, 500)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default React.forwardRef(AdminModalShowToken);