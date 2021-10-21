import axios from 'axios';
import React, { useState, useImperativeHandle, useRef } from 'react'
import { toast } from 'react-toastify';
import { Button, Form, Modal, TextArea, Checkbox, Dropdown } from 'semantic-ui-react'
import { collectFormData } from '../../utils'

function CreateCasesModal(props, ref) {
  const createCases = props.createCases
  const [open, setOpen] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [formData, setFormData] = useState({})
  const formRef = useRef(null)

  function dropdownChangeHandler(e, data) {
    setFormData({ ...formData, content_type: data.value })
  }

  const contentTypeOptions = [
    {
      key: "application/json",
      text: "application/json",
      value: "application/json"
    },
    {
      key: "multipart/form-data",
      text: "form-data",
      value: "multipart/form-data"
    },
    {
      key: "application/x-www-form-urlencoded",
      text: "x-www-form-urlencoded",
      value: "application/x-www-form-urlencoded"
    },
    {
      key: "text/plain",
      text: "raw-text",
      value: "text/plain"
    },
    {
      key: "text/html",
      text: "raw-html",
      value: "text/html"
    },
    {
      key: "application/xml",
      text: "raw-xml",
      value: "application/xml"
    },
    {
      key: "application/octet-stream",
      text: "binary",
      value: "application/octet-stream",
    },
    {
      key: "proxy",
      text: "Proxy Target URL",
      value: "proxy"
    },
    {
      key: "redirect",
      text: "Redirect to other URL",
      value: "redirect"
    }
  ]

  function show() {
    setOpen(true);
  }

  useImperativeHandle(ref, () => ({
    show
  }))

  function createCaseHandler(e) {
    e.preventDefault();
    let formVal = collectFormData(e.target);
    if (!formVal.user_id || !formVal.username || !formVal.password) {
      toast.error("All fields are required")
      return;
    }
    if (formVal.password !== formVal.repeat_password) {
      toast.error("Passwords mismatch, please check")
      return;
    }
    setRequesting(true);
    axios.post('/api/record/create', formVal).then(res => {
      setRequesting(false);
      if (res.status === 200 && res.data.code) {
        toast.success("Create Successfully");
        createCases.current.show(res.data.data.record_id);
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
      onSubmit={createCaseHandler}
      ref={formRef}
    >
      <Modal.Header>Create Case</Modal.Header>
      <Modal.Content>
        <Form.Field>
          <label>Case ID</label>
          <input placeholder='A unique ID' name='case_id' />
        </Form.Field>
        <Form.Field>
          <label>Content-Type</label>
          <Dropdown placeholder='Content-Type' name="content_type" search selection options={contentTypeOptions} defaultValue="application/json" onChange={dropdownChangeHandler} />
        </Form.Field>
        {formData.content_type === 'proxy' || formData.content_type === 'redirect' ? <Form.Field>
          <label>URL</label>
          <input placeholder='Target URL for proxy or redirect' name='url' />
        </Form.Field> : ''}
        {formData.content_type === 'proxy' ? <Form.Field>
          <Checkbox label='Auto Support CORS Policy' name='cors' />
        </Form.Field> : ''}
        {formData.content_type !== 'proxy' && formData.content_type !== 'redirect' ? <>
          <Form.Field>
            <label>HTTP Status</label>
            <input placeholder='HTTP status code, usually 200' name='status' type='number' defaultValue={200} />
          </Form.Field>
          <Form.Field>
            <label>Response Body</label>
            <TextArea defaultValue={""} />
          </Form.Field></>
          : ''}
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Create"
          labelPosition='right'
          icon='check'
          type='submit'
          positive
          loading={requesting}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default React.forwardRef(CreateCasesModal);