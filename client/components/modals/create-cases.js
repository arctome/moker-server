import axios from 'axios';
import React, { useState, useImperativeHandle, useRef } from 'react'
import { toast } from 'react-toastify';
import { Button, Form, Modal, TextArea, Checkbox, Dropdown } from 'semantic-ui-react'
import { collectFormData } from '../../utils'

function CreateCasesModal(props, ref) {
  const createCases = props.createCases
  const [open, setOpen] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [formData, setFormData] = useState({ content_type: "application/json" })
  const [recordId, setRecordId] = useState(null)
  const formRef = useRef(null)

  function resetModal() {
    setFormData({ content_type: "application/json" })
    setRecordId(null)
  }

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

  function show(record_id, case_id = "") {
    resetModal()
    if (!record_id) {
      toast.error("Unexpected record id");
      return;
    }
    setOpen(true);
    setRecordId(record_id)
    if (case_id) {
      fetchCaseData(record_id, case_id)
    }
  }
  function fetchCaseData(record_id, case_id) {
    axios.get('/api/cases/detail', { params: { record_id, case_id } }).then(res => {
      if (res.status === 200 && res.data.code) {
        setFormData({ ...res.data.data, case_id });
      } else {
        console.log(res)
      }
    })
  }

  useImperativeHandle(ref, () => ({
    show
  }))

  function createCaseHandler(e) {
    e.preventDefault();
    let formVal = collectFormData(e.target);
    if (formData.case_id) {
      formVal = Object.assign(formData, formVal);
    } else {
      formVal = Object.assign(formVal, formData);
    }
    if (!formVal.case_id || !formVal.content_type) {
      toast.error("Case ID & Content-Type are required")
      return;
    }
    if (formVal.content_type === 'proxy' || formVal.content_type === 'redirect') {
      if (!formVal.url) {
        toast.error("URL is required");
        return;
      }
    }
    formVal.record_id = recordId;
    setRequesting(true);
    axios.post('/api/cases/create', formVal).then(res => {
      setRequesting(false);
      if (res.status === 200 && res.data.code) {
        toast.success("Create Successfully");
        setTimeout(() => {
          setOpen(false);
          window.location.reload();
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
      <Modal.Header>{formData.case_id ? 'Edit Case: ' + formData.case_id : 'Create Case'}</Modal.Header>
      <Modal.Content>
        <Form.Field>
          <label>Case ID</label>
          <input placeholder='A unique ID' name='case_id' disabled={formData.case_id} defaultValue={formData.case_id} />
        </Form.Field>
        <Form.Field>
          <label>Content-Type</label>
          <Dropdown placeholder='Content-Type' name="content_type" search selection options={contentTypeOptions} value={formData.content_type || "application/json"} onChange={dropdownChangeHandler} />
        </Form.Field>
        {formData.content_type === 'proxy' || formData.content_type === 'redirect' ? <Form.Field>
          <label>URL</label>
          <input placeholder='Target URL for proxy or redirect' name='url' defaultValue={formData.url} />
        </Form.Field> : ''}
        {formData.content_type === 'proxy' ? <Form.Field>
          <Checkbox label='Auto Support CORS Policy' name='cors' defaultValue={formData.cors} />
        </Form.Field> : ''}
        {formData.content_type !== 'proxy' && formData.content_type !== 'redirect' ? <>
          <Form.Field>
            <label>HTTP Status</label>
            <input placeholder='HTTP status code, usually 200' name='status' type='number' defaultValue={formData.status || 200} />
          </Form.Field>
          <Form.Field>
            <label>Response Body</label>
            <TextArea defaultValue={formData.body || ''} name="body" />
          </Form.Field></>
          : ''}
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content={formData.case_id ? "Update" : "Create"}
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