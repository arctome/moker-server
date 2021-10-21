import axios from 'axios';
import React, { useState, useImperativeHandle , useEffect} from 'react'
import { toast } from 'react-toastify';
import { Button, Modal, Form, Dropdown, Label, Icon, Checkbox } from 'semantic-ui-react'
import { useStore } from '../../state-persistence';

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
        
        setCollections(data.collections)
        setCurrentCollections(data.collections)
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
    useEffect(() => {
        if(state.user) setCurrentUser(state.user)
    }, [state])

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
                    {/* FIXME: Collections' dropdown doesn't show selected tag */}
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
                                <Label>
                                    <Icon name='external alternate' />
                                    CASE:
                                    <Label.Detail>{k.case_id}</Label.Detail>
                                </Label>
                            )
                        }) : <p>No Cases created</p>
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
                        onClick={() => {createCasesHandler(data.record_id)}}
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