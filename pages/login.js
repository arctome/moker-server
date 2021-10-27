import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { collectFormData } from '../client/utils'
import { toast } from 'react-toastify';
import axios from 'axios'
import { useStore } from '../client/state-persistence/index'

export default function LoginPage() {
  const [state, dispatch] = useStore();

  function dispatchLoginHandler(data) {
    dispatch({type: 'login', data})
  }

  const handleLoginSubmit = function(e) {
    e.preventDefault();
    let formVal = collectFormData(e.target);
    if(!formVal.username || !formVal.password) {
      toast.error("Username or Password cannot be empty!");
      return;
    }
    let formData = new URLSearchParams();
    Object.keys(formVal).forEach(key => {
      formData.append(key, formVal[key]);
    })
    axios.post('/api/user/login', formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(r => {
      if(r.status === 200 && r.data.code) {
        toast.success("Login successful");
        dispatchLoginHandler({user_id: formVal.username, username: r.data.data.name})
        setTimeout(() => {
          window.location.href = '/admin'
        }, 500)
      } else {
        toast.error(r.data.msg || "Unknown error occurs")
      }
    })
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='/logo.png' /> Log-in to your account
        </Header>
        <Form size='large' onSubmit={handleLoginSubmit}>
          <Segment stacked>
            <Form.Input fluid name="username" icon='user' iconPosition='left' placeholder='User Account' />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Your Password'
              name="password"
              type='password'
            />
            <Button color='teal' fluid size='large'>
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? Contact the Admin to invite you.
        </Message>
      </Grid.Column>
    </Grid>
  )
}