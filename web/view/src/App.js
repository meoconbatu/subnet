import { useEffect, useState, useReducer } from 'react';
import { Header, Divider } from 'semantic-ui-react'
import axios from "axios";
import CIDRForm from './CIDRForm';
import SubnetTable from './SubnetTable';

const reducer = (state, action) => {
  switch (action.type) {
    case 'submit':
      return {
        networks: action.networks, maxHeight: action.maxHeight, searchFound: null
      }
    case 'divide':
      return {
        networks: action.networks, maxHeight: action.maxHeight > state.maxHeight ? action.maxHeight : state.maxHeight, searchFound: null
      }
    case 'join':
      return {
        networks: action.networks, maxHeight: action.maxHeight, searchFound: null
      }
    case 'note':
      return {
        ...state, networks: action.networks, searchFound: null
      }
    case 'upload':
      return {
        networks: action.networks, maxHeight: action.maxHeight, searchFound: null
      }
    case 'search':
      return {
        ...state, networks: action.networks, searchFound: action.searchFound
      }
    case 'reset':
      return {
        networks: action.networks, maxHeight: action.maxHeight, searchFound: null
      }
    default:
      return { ...state }
  }
}
function App() {
  // axios.defaults.baseURL = 'http://localhost:8080'
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  const [state, dispatch] = useReducer(
    reducer,
    {
      networks: sessionStorage.getItem('stateNetworks') ? new Map(Object.entries(JSON.parse(sessionStorage.getItem('stateNetworks')))) : new Map(),
      maxHeight: JSON.parse(sessionStorage.getItem('stateMaxHeight')) || 0,
      searchFound: null
    }
  )
  // const [networks, setNetworks] = useState(new Map())
  const qs = require('qs')
  useEffect(() => {
    sessionStorage.setItem('stateNetworks', JSON.stringify(Object.fromEntries(state.networks)))
    sessionStorage.setItem('stateMaxHeight', JSON.stringify(state.maxHeight))
  })
  const addSubnet = (root, cidr, children) => {
    if (root.cidr === cidr) {
      root.children = children
      root.children[0].note = root.note
      root.numVisibleChild += 1
      return 1
    }
    if (root.children == null) {
      return 0
    }
    for (var i = 0; i < root.children.length; i++) {
      if (addSubnet(root.children[i], cidr, children) === 1) {
        root.numVisibleChild += 1
        return 1
      }
    }
    return 0
  }
  const deleteSubnet = (root, cidr) => {
    if (root.cidr === cidr) {
      root.children = null
      const temp = root.numVisibleChild
      root.numVisibleChild = 1
      return temp - 1
    }
    if (root.children == null) {
      return 0
    }
    for (var i = 0; i < root.children.length; i++) {
      const temp = deleteSubnet(root.children[i], cidr)
      root.numVisibleChild -= temp
      if (temp > 0) {
        return temp
      }
    }
    return 0
  }
  var maxPref = 0
  const getMaxPrefix = (root) => {
    if (root.children == null) {
      if (root.prefix > maxPref) {
        maxPref = root.prefix
      }
    }
    else {
      for (var i = 0; i < root.children.length; i++) {
        getMaxPrefix(root.children[i])
      }
    }
  }

  const getMaxHeight = (networks) => {
    var maxHeight = 0
    for (const [network, entry] of networks) {
      if (entry.maxPrefix - entry.subnets.prefix + 1 > maxHeight) {
        maxHeight = entry.maxPrefix - entry.subnets.prefix + 1
      }
    }
    return maxHeight
  }
  const updateNote = (root, cidr, note) => {
    if (root.cidr === cidr) {
      root.note = note
      return true
    }

    if (root.children == null) {
      return false
    }
    for (var i = 0; i < root.children.length; i++) {
      if (updateNote(root.children[i], cidr, note)) {
        return true
      }
    }
    return false
  }
  const searchNode = (root, activeNode) => {
    if (root.active) {
      root.active = false
    }
    if (root.cidr === activeNode.cidr) {
      root.active = true
    }
    if (root.children == null) {
      return false
    }
    for (var i = 0; i < root.children.length; i++) {
      searchNode(root.children[i], activeNode)
    }
    return false
  }
  const handleSubmit = (addr, pref) => {
    axios.post('/subnet', qs.stringify({ address: addr, prefix: pref }))
      .then(function (response) {
        const root = new Map(state.networks)
        root.set(response.data.cidr, { subnets: response.data, maxPrefix: pref })
        // setNetworks(root)
        dispatch({ type: 'submit', networks: root, maxHeight: getMaxHeight(root) })
      })
      .catch(function (error) {
        console.log(error)
      });
  }
  const handleReset = () => {
    dispatch({ type: 'reset', networks: new Map(), maxHeight: 0 })
  }
  const handleDivide = (cidr, network) => {
    axios.post('/divide', qs.stringify({ cidr: cidr }))
      .then(function (response) {
        const children = response.data
        const root = new Map(state.networks) //JSON.parse(JSON.stringify(networks.get(network)))
        addSubnet(root.get(network).subnets, cidr, children)
        if (children[0].prefix > root.get(network).maxPrefix) {
          root.get(network).maxPrefix = children[0].prefix
        }
        // setNetworks(root)
        dispatch({ type: 'divide', networks: root, maxHeight: getMaxHeight(root) })
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const handleJoin = (cidr, network) => {
    const root = new Map(state.networks) // JSON.parse(JSON.stringify(networks.get(network)))
    deleteSubnet(root.get(network).subnets, cidr)
    getMaxPrefix(root.get(network).subnets)
    getMaxPrefix(root)
    root.get(network).maxPrefix = maxPref
    // setNetworks(root)
    dispatch({ type: 'join', networks: root, maxHeight: getMaxHeight(root) })
  }
  const handleNote = (cidr, note, network) => {
    const root = new Map(state.networks) //JSON.parse(JSON.stringify(state.subnets.get(network)))
    updateNote(root.get(network).subnets, cidr, note)
    // setNetworks(networks.set(network, { subnets: root, maxPrefix: networks.get(network).maxPrefix }))
    dispatch({ type: 'note', networks: root })
  }
  const handleDownload = () => {
    axios.post('/download', Object.fromEntries(state.networks)
      //  new Blob([JSON.stringify(state.networks)], { type: "application/json" })
    )
      .then(function (response) {
        var obj = JSON.parse(JSON.stringify(response.data))
        const blob = new Blob([JSON.stringify(obj, null, 5)], { type: "text/plain" })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'networks.txt')
        link.click()
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const handleUpload = (newsubnets) => {
    axios.post(
      '/upload', newsubnets
    )
      .then(function (response) {
        const root = new Map(Object.entries(response.data))
        dispatch({ type: 'upload', networks: root, maxHeight: getMaxHeight(root) })
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const handleSearch = (searchStr) => {
    if (state.networks == null) {
      return
    }
    axios.post(
      '/search', { network: Object.fromEntries(state.networks), cidr: searchStr }
      // new Blob([JSON.stringify({ network: Object.fromEntries(state.subnets), cidr: searchStr })], { type: "application/json" }),
    )
      .then(function (response) {
        const root = new Map(state.networks)
        const result = new Map(Object.entries(response.data))
        if (result.size === 0) {
          for (const [network] of root) {
            searchNode(root.get(network).subnets, { CIDR: '' })
          }
        } else {
          for (const [network, entry] of result) {
            searchNode(root.get(network).subnets, entry)
          }
        }
        // searchNode(root, response.data)
        dispatch({ type: 'search', networks: root, searchFound: result.size })
      })
      .catch(function (error) {
        const root = new Map(state.networks)
        for (const [network] of root) {
          searchNode(root.get(network).subnets, { CIDR: '' })
        }
        dispatch({ type: 'search', networks: root, searchFound: 0 })
      });
  }
  return (
    <>
      <Header as='h1'>IPv4 Subnetting</Header>
      <Divider hidden />
      <CIDRForm onSubmit={handleSubmit} onReset={handleReset} onDownload={handleDownload} onUpload={handleUpload} onSearch={handleSearch} searchFound={state.searchFound} />
      <Divider hidden />
      <SubnetTable networks={state.networks} maxHeight={state.maxHeight} onDivide={handleDivide} onJoin={handleJoin} onNote={handleNote} />
    </>
  );
}

export default App;
