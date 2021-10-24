import axios from 'axios';
import React, { useState, useImperativeHandle, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Button, Modal, Form, Dropdown, Label, Icon } from 'semantic-ui-react'
import { useStore } from '../../state-persistence';
import { collectFormData, convertPureArrToDropdownOpt } from '../../utils'

function RecordDetailModal(props, ref) {
    const [open, setOpen] = useState(false)
    const [requesting, setRequesting] = useState(false)
    const [data, setData] = useState({})
    const [collections, setCollections] = useState([])
    const [currentCollections, setCurrentCollections] = useState([])
    const createCasesHandler = props.createCasesHandler;
    const [state, dispatch] = useStore()
    const [currentUser, setCurrentUser] = useState({})

    function show(data) {
        setOpen(true);
        setData(data);

        setCollections(convertPureArrToDropdownOpt(data.collections))
        setCurrentCollections(data.collections)
    }

    useImperativeHandle(ref, () => ({
        show
    }))

    function updateRecordHandler(e) {
        e.preventDefault();
        let formVal = collectFormData(e.target)
        if(!data.record_id) {
            toast.error("No record id detected!")
            return;
        }
        formVal.record_id = data.record_id;
        formVal.collections = currentCollections
        axios.post('/api/record/update', formVal).then(res => {
            if(res.status === 200 && res.data.code) {
                toast.success("Record updated successfully");
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            } else {
                toast.error(res.data.msg || "Unknow error occurs");
                console.log(res)
            }
        }).catch(err => {
            toast.error(err.message || "Axios error")
        })
    }
    // Dropdown
    function handleAddition(e, data) {
        let newArr = collections
        newArr.push({ text: data.value, key: data.value, value: data.value })
        setCollections(newArr)
    }
    function handleChange(e, data) {
        setCurrentCollections(data.value)
    }
    useEffect(() => {
        if (state.user) setCurrentUser(state.user)
    }, [state])
    function fetchRecordCases(record_id) {
        axios.get('/api/record/find', { params: { "record_id": record_id } }).then(res => {
            if (res.status === 200 && res.data.code) {
                setData({ ...data, cases: res.data.data.cases ? res.data.data.cases.split(",") : [] })
            }
        })
    }
    useEffect(() => {
        if (data.record_id) {
            fetchRecordCases(data.record_id)
        }
    }, [data.record_id])
    function editCaseModal(record_id, case_id) {
        createCasesHandler(record_id, case_id)
    }
    function delCaseHandler(record_id, case_id) {
        axios.post('/api/cases/delete', { record_id, case_id }).then(res => {
            if (res.status === 200 && res.data.code) {
                toast.success("Case deleted successfully")
                setOpen(false)
            } else {
                console.log(res)
            }
        })
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            as={Form}
            onSubmit={updateRecordHandler}
        >
            <Modal.Header>Mock Record Detail</Modal.Header>
            <Modal.Content>
                <Form.Field>
                    <label>Name</label>
                    <input placeholder='A unique ID' name='name' defaultValue={data.name} />
                </Form.Field>
                <Form.Field>
                    <label>URL</label>
                    <input placeholder='A unique name' name='url' defaultValue={data.url} />
                </Form.Field>
                <Form.Field>
                    {/* <label>Visibility</label> */}
                    {/* <Checkbox label='Only me visible?' name='private_read' defaultChecked={data.private_read} /> */}
                    <label>Private Read</label>
                    <input type="checkbox" name="private_read" defaultChecked={data.private_read} />
                </Form.Field>
                <Form.Field>
                    <label>Collections</label>
                    <Dropdown
                        options={collections}
                        placeholder='Choose Collections'
                        search
                        selection
                        fluid
                        multiple
                        allowAdditions
                        value={currentCollections}
                        onAddItem={handleAddition}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Cases</label>
                    {
                        data.cases && Array.isArray(data.cases) ? data.cases.map(k => {
                            return (
                                <Label style={{ cursor: 'pointer' }} onClick={() => { editCaseModal(data.record_id, k) }}>
                                    <Icon name='external alternate' />
                                    CASE
                                    <Label.Detail>{k}</Label.Detail>
                                    <Icon name='delete' onClick={(e) => {
                                        e.stopPropagation();
                                        delCaseHandler(data.record_id, k);
                                    }} />
                                </Label>
                            )
                        }) : ""
                    }
                </Form.Field>
            </Modal.Content>
            <Modal.Actions style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Button
                        content="Delete"
                        labelPosition='right'
                        icon='trash'
                        negative
                        loading={requesting}
                    />
                    <Button
                        content="Create Case"
                        labelPosition='right'
                        icon='plus'
                        onClick={() => { createCasesHandler(data.record_id) }}
                    />
                </div>

                <div>
                    <Button color='black' onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <Button
                        content="Update"
                        labelPosition='right'
                        icon='check'
                        positive
                        loading={requesting}
                    />
                </div>
            </Modal.Actions>
        </Modal>
    )
}

export default React.forwardRef(RecordDetailModal);