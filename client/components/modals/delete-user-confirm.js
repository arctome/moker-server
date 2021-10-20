import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import axios from 'axios'

function DeleteUserConfirmModal(props, ref) {
  const user_id = props.userid;
  const [open, setOpen] = React.useState(false)
  const [requesting, setRequesting] = useState(false)

  function deleteUser() {
    if (!user_id) return;
    setRequesting(true)
    axios.post('/api/user/delete', { user_id }).then(res => {
      if (res.status === 200 && res.data.code) {
        toast.success("User has been deleted");
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
        Delete User
      </Header>
      <Modal.Content>
        <p>
          The user deleted will not be able to revert, and the records will be deleted soon, PLEASE consider !
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={() => setOpen(false)}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' inverted loading={requesting} onClick={deleteUser}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default DeleteUserConfirmModal