import React, { useState } from 'react'
import { Button, Confirm } from 'semantic-ui-react'

const ConfirmButton = (props) => {
    const [open, setOpen] = useState(false)
    return (
        <div>
            <Button type='button' onClick={() => setOpen(true)}>{props.name}</Button>
            <Confirm
                open={open}  
                onCancel={() => setOpen(false)}
                onConfirm={() => {props.onConfirm(); setOpen(false)}}
                content={props.content}
            />
        </div>
    )
}

export default ConfirmButton