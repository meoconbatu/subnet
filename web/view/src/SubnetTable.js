import React, { useState, useRef, useEffect } from 'react'
import { Table, Form, Button, TextArea, Ref } from 'semantic-ui-react'

const drawTableBody = (network, subnet, rows, parent, props, activeRowRef, groupBy, obj, maxPrefix, index) => {
    if (subnet == null) {
        return
    }
    if (subnet.children == null) {
        const row =
            <SubnetRow
                maxHeight={props.maxHeight} key={subnet.cidr + network + subnet.note} network={network} groupBy={obj.root && groupBy}
                subnet={subnet} onNote={props.onNote} onDivide={props.onDivide} parent={parent} maxPrefix={maxPrefix} index={index}

            />
        obj.root = false
        rows.push(row)
        return
    }
    subnet.children.map((child, i) => {
        if (i === 0) {
            var cell =
                <Table.Cell active={subnet.active ? 'active' : ''}
                    onClick={() => { props.onJoin(subnet.cidr, network) }} style={{ textAlign: "right" }}
                    rowSpan={subnet.numVisibleChild} selectable={subnet.numVisibleChild > 1 ? 'true' : 'false'}>/{subnet.prefix}
                </Table.Cell>
            if (subnet.active) {
                cell = <Ref innerRef={activeRowRef}>{cell}</Ref>
            }
            parent = <>{cell}{parent}</>
        }
        else {
            parent = null
        }
        return drawTableBody(network, child, rows, parent, props, activeRowRef, groupBy, obj, maxPrefix, index)
    })
}

const DivideButton = (props) => {
    const handleClick = () => {
        props.onDivide(props.subnet.cidr, props.network)
    }
    return (
        <Button basic size='mini' onClick={handleClick}>Divide</Button>
    )
}
const NoteTextArea = (props) => {
    const [note, setNote] = useState(props.subnet.note)
    const handleChange = (e) => {
        setNote(e.target.value)
        // props.onChange(props.subnet.cidr, e.target.value)
    }
    return (
        <Form>
            <TextArea fluid rows={1} style={{ borderStyle: 'none' }}
                onBlur={(e) => { props.onChange(props.subnet.cidr, e.target.value, props.network) }}
                onChange={handleChange} value={note}
            />
        </Form>
    )
}
const SubnetRow = (props) => {
    const ipRangediff = props.subnet.availableIPMin !== props.subnet.availableIPMax
    const temp = props.maxPrefix - props.subnet.prefix + 1 + props.maxHeight - (props.maxPrefix - props.network.split("/")[1] + 1)
    const divStyle = {
        borderTop: 'solid 2px grey',
    };
    return (
        <Table.Row style={props.groupBy && props.index !== 0 ? divStyle : null}>
            {props.groupBy}
            <Table.Cell>{props.subnet.cidr}</Table.Cell>
            <Table.Cell>{props.subnet.mask}</Table.Cell>
            <Table.Cell singleLine>{props.subnet.availableIPMin} {ipRangediff ? '- ' + props.subnet.availableIPMax : ''}</Table.Cell>
            <Table.Cell>{props.subnet.hosts}</Table.Cell>
            <Table.Cell>
                <NoteTextArea onChange={props.onNote} subnet={props.subnet} network={props.network} />
            </Table.Cell>
            <Table.Cell>
                {props.subnet.hosts > 1 &&
                    <DivideButton onDivide={props.onDivide} subnet={props.subnet} network={props.network} />
                }
            </Table.Cell>
            <Table.Cell active={props.subnet.active ? 'active' : ''} style={{ textAlign: "right" }} colSpan={temp}>/{props.subnet.prefix}</Table.Cell>
            {props.parent}
        </Table.Row>
    )
}
const drawNetwork = (props, rows, activeRowRef) => {
    var index = 0
    for (const [network, entry] of props.networks) {
        var groupBy = <Table.Cell rowSpan={entry.subnets.numVisibleChild}>{network}</Table.Cell>
        drawTableBody(network, entry.subnets, rows, null, props, activeRowRef, groupBy, { root: true }, entry.maxPrefix, index)
        index++
    }
}
const SubnetTable = (props) => {
    const activeRowRef = useRef(null)
    const rows = []
    drawNetwork(props, rows, activeRowRef)
    // drawTableBody(props.subnets, rows, null, props, activeRowRef)
    useEffect(() => {
        if (activeRowRef.current != null) {
            activeRowRef.current.focus()
            activeRowRef.current.scrollIntoView(false)
        }
    })
    return (
        <Table celled structured style={{ border: '2px solid grey' }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Network address</Table.HeaderCell>
                    <Table.HeaderCell>Subnet address</Table.HeaderCell>
                    <Table.HeaderCell>Netmask</Table.HeaderCell>
                    <Table.HeaderCell>Available IPs</Table.HeaderCell>
                    <Table.HeaderCell>Hosts</Table.HeaderCell>
                    <Table.HeaderCell>Note</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell colSpan={props.networks != null ? props.maxHeight : 1}></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {rows}
            </Table.Body>
        </Table>
    )
}

export default SubnetTable