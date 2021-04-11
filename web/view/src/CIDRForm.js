import React, { useState, useRef, useReducer } from 'react'
import { Button, Form, Grid, Ref, Input, Icon } from 'semantic-ui-react'
import ConfirmButton from './ConfirmButton'

const reducer = (state, action) => {
  const { name, value, hasError, error, isFormValid } = action.data
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        [name]: { value, hasError, error },
        isFormValid
      }
    default:
      return { ...state }
  }
}
const CIDRForm = (props) => {
  const [search, setSearch] = useState('')

  const [state, dispatch] = useReducer(reducer,
    {
      address: { value: '192.168.0.0', hasError: false, error: '' },
      prefix: { value: '25', hasError: false, error: '' },
      isFormValid: true
    })
  const fileRef = useRef(null)

  const handleConfirm = () => {
    props.onSubmit(state.address.value, state.prefix.value)
  }
  const handleReset = () => {
    props.onReset()
  }
  const handleDownload = () => {
    props.onDownload()
  }
  const handleUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      props.onUpload(e.target.result)
    };
    fileRef.current.value = ''
  }
  const handleSearch = () => {
    if (search !== '') {
      props.onSearch(search)
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    const { hasError, error } = validateInput(name, value)
    let isFormValid = true
    for (const key in state) {
      const item = state[key]
      if (key === name && hasError) {
        isFormValid = false
        break
      } else if (key !== name && item.hasError) {
        isFormValid = false
        break
      }
    }
    dispatch({ type: 'UPDATE', data: { name, value, hasError, error, isFormValid } })
  }
  const validateInput = (name, value) => {
    let hasError = false, error = ''
    switch (name) {
      case 'address':
        if (!/^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$/.test(value)) {
          hasError = true
        }
        break
      case 'prefix':
        if (!/^([0-9]|[1-2][0-9]|3[0-2])$/.test(value)) {
          hasError = true
        }
        break
      default:
        hasError = true
    }
    return { hasError, error }
  }

  return (
    <Grid columns={2}>
      <Grid.Column>
        <Form>
          <Form.Group inline>
            <Form.Input name='address' error={state.address.hasError && true} label='CIDR:' width={4} onChange={handleChange} value={state.address.value} />
            <Form.Input name='prefix' error={state.prefix.hasError && true} label='/' width={2} onChange={handleChange} value={state.prefix.value} />
            <ConfirmButton name='Add' onConfirm={handleConfirm} content='The subnet you wish to add, if exists, will be gone. Continue?'/>
            <ConfirmButton name='Reset' onConfirm={handleReset} content='All subnets will be gone. Continue?'/>
          </Form.Group>
        </Form>
      </Grid.Column>
      <Grid.Column textAlign='right'>
        <Ref innerRef={fileRef}>
          <input onChange={handleUpload} type='file' style={{ display: 'none' }} />
        </Ref>
        <Input style={{ margin: '0 .25em 0 0' }}
          onKeyDown={(e) => e.key === 'Enter' ? handleSearch() : null}
          onChange={e => setSearch(e.target.value)}
          icon={<Icon onClick={handleSearch} name='search' link />}
          placeholder='Search...'
        />
        <Button type='button' onClick={e => fileRef.current.click()}>Upload</Button>
        <Button type='button' onClick={handleDownload}>Download</Button>
      </Grid.Column>
    </Grid>
  )
}

export default CIDRForm