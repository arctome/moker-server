import Layout from '../../client/layout/Layout'
import ResetPassword from '../../client/components/modals/reset-password'
import { Form, Button } from 'semantic-ui-react'
import { useStore } from '../../client/state-persistence'
import { useEffect, useRef, useState } from 'react'
import { collectFormData } from '../../client/utils'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function AdminRecordsPage() {
  const [state] = useStore()
  const [isAdmin, setIsAdmin] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const resetPasswordRef = useRef(null)

  useEffect(() => {
    if (state.user && state.user.user_id === 'admin') {
      setIsAdmin(true)
    }
  }, [state])

  function updateProfileHandler(e) {
    e.preventDefault();
    let formVal = collectFormData(e.target);
    if (!formVal.username) {
      toast.error("Username cannot be empty");
      return;
    }
    axios.post('/api/user/update-profile', formVal).then(res => {
      setRequesting(false);
      if (res.status === 200 && res.data.code) {
        toast.success("Update profile successfully")
        setTimeout(() => {
          window.location.reload();
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
    <Layout>
      {isAdmin ? <p style={{ color: 'red' }}>You are admin user, any profile changes should be updated in deployment.</p> : ''}
      <Form onSubmit={updateProfileHandler}>
        <Form.Field>
          <label>User ID</label>
          <input placeholder='User ID (Not editable)' value={state.user ? state.user.user_id : ''} readonly />
        </Form.Field>
        <Form.Field>
          <label>Username</label>
          <input placeholder='Username' defaultValue={state.user ? state.user.username : ''} name='username' disabled={isAdmin} />
        </Form.Field>
        <Form.Field style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button icon='edit' type='button' disabled={isAdmin} onClick={() => {resetPasswordRef.current.show()}}>Reset Password</Button>
          <Button disabled={isAdmin} type='submit' loading={requesting} primary>Submit</Button>
        </Form.Field>
      </Form>
      <ResetPassword userid={state.user ? state.user.user_id : null} ref={resetPasswordRef} />
    </Layout>
  )
}