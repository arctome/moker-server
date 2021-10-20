import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import axios from 'axios'

function DeleteConfirmModal(props, ref) {
  const token_id = props.tokenid;
  const [open, setOpen] = React.useState(false)
  const [requesting, setRequesting] = useState(false)

  function deleteToken() {
    if (!token_id) return;
    setRequesting(true)
    axios.post('/api/token/revoke', { token_id }).then(res => {
      if (res.status === 200 && res.data.code) {
        toast.success("Token has been deleted");
        setTimeout(() => {
          setRequesting(false);
          setOpen(false);
          window.location.reload();
        }, 500)
      } else {
        toast.error(res.data.msg || "Unknown Error")
      }
    })
  }

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      trigger={props.trigger}
    >
      <Header icon>
        <Icon name='trash' />
        Delete Token
      </Header>
      <Modal.Content>
        <p>
          The token deleted will not be able to revert, PLEASE consider !
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={() => setOpen(false)}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' inverted loading={requesting} onClick={deleteToken}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default DeleteConfirmModal