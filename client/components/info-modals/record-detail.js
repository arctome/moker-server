import axios from 'axios';
import React, { useState, useImperativeHandle } from 'react'
import { toast } from 'react-toastify';
import { Button, Modal, Form, Dropdown, Label } from 'semantic-ui-react'

function RecordDetailModal(props, ref) {
    const [open, setOpen] = useState(false)
    const [requesting, setRequesting] = useState(false)
    const [data, setData] = useState({})
    const [collections, setCollections] = useState([])
    const [currentCollections, setCurrentCollections] = useState([])

    function show(data) {
        setOpen(true);
        setData(data);
    }

    useImperativeHandle(ref, () => ({
        show
    }))

    function updateRecordHandler(e) {
        e.preventDefault();
    }
    // Dropdown
    function handleAddition(e, data) {
        let newArr = collections.slice()
        newArr.push({ text: data.value, key: data.value, value: data.value })
        setCollections(newArr)
    }
    function handleChange(e, data) {
        setCurrentCollections(data.value)
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
                    <Label>
                        <Icon name='mail' />
                        23
                        <Label.Detail>View Mail</Label.Detail>
                    </Label>
                </Form.Field>
            </Modal.Content>
            <Modal.Actions style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    content="Delete"
                    labelPosition='right'
                    icon='trash'
                    negative
                    loading={requesting}
                />

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