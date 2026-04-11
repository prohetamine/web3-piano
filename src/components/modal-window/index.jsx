/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { useStasPay } from 'stas-pay'
import { StyleСontrols, Button, Container, NormalText, Flex, Input, ShadowContainer, Title, Icon, Author, ListContainer, ListItemContainer } from './styles'
import * as Redstone from '@prohetamine/redstone'
import formatPianoData from '../piano/format-piano-data'

import iconSearch from './../../assets/small/search.svg'
import iconPublish from './../../assets/small/publish.svg'
import iconTrash from './../../assets/small/trash.svg'
import iconHeart from './../../assets/small/heart.svg'
import iconHeartFill from './../../assets/small/heart-fill.svg'
import iconHeartLoading from './../../assets/small/heart-loading.svg'
import iconNote from './../../assets/small/note.svg'

export const ModalWindowContext = createContext(undefined)

export const ModalWindowProvider = ({ children }) => {
  const [show, setShow] = useState(null)
      , [input, setInput] = useState('')

  const showModalWindow = data => {
    setInput(data?.input?.value || '')

    return new Promise(resolve => {
        setShow({
          ...data,
          buttons: data.buttons.map(button => ({
            ...button,
            onTap: (response, input) => {
              resolve([response, input])
              setShow(null)
            }
          }))
        })
    })
  }

  return (
    <ModalWindowContext.Provider value={showModalWindow}> 
      {
        show 
          ? (
            <ShadowContainer>
              <Container style={{ maxWidth: '300px' }}>
                <Flex gap='10px' style={{ width: '100%' }}>
                  <Flex gap='5px' style={{ width: '100%' }}>
                    {
                      show.title
                        ? (
                          <Title>{show.title}</Title>
                        )
                        : null
                    }
                    {
                      show.description 
                        ? (
                          <NormalText style={{ width: '100%' }}>{show.description}</NormalText>     
                        )
                        : null
                    }
                  </Flex>
                  {
                    show.input 
                      ? (
                        <StyleСontrols>
                          <Input
                            placeholder={show.input.placeholder} 
                            value={input}
                            onChange={({ target: { value } }) => setInput(value)}
                          />
                          {
                            show.input.icon
                              ? (
                                <Icon src={show.input.icon} />
                              )
                              : null
                          }
                        </StyleСontrols>
                      )
                      : null
                  }
                  <Flex align='flex-end' style={{ width: '100%' }}>
                    <Flex gap='10px' direction='row'>
                      {
                        show.buttons.map((button, key) => (
                          <Button 
                            key={key} 
                            onTap={() => button.onTap(button.response, input)}
                          >{button.label}</Button>
                        ))
                      }
                    </Flex>
                  </Flex>
                </Flex>
              </Container>
            </ShadowContainer>
          )
          : (
            null
          )
      }
      {children}
    </ModalWindowContext.Provider>
  )
}

const ListItem = ({ isLocal, track, onSelect, onDelete, onPublish, style }) => {
  const author = Redstone.useReadNote(`author`, { address: track.address, value: track.address, self: true, selfRead: true, load: !isLocal, cache: 60000 })
  
  const like = Redstone.useCounter(`like`, {
    copyId: `${track.index}-${track.chainId}`,
    switching: true,
    watch: false,
    cache: 60000,
    load: !isLocal
  })

  const { isConnected } = Redstone.useApp()

  return (
    <ListItemContainer 
      style={style}
    >
      <Flex direction='row' style={{ width: '100%' }}>
        <Flex 
          gap='2px' 
          style={{ width: 'calc(100% - 58px)' }}
        >
          <NormalText
            onTap={onSelect}
            style={{
              width: '100%',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word'
            }}
          >{track.title}</NormalText>
          {
            !isLocal 
              ? (
                <Author
                  style={{
                    width: '100%'
                  }}
                >{author.status === 'success' ? author.value : '...'}</Author>
              )
              : null
          }
        </Flex>
        {
          isLocal 
            ? (
              <Flex gap='10px' direction='row'>
                <Icon 
                  whileTap={{ scale: 0.9 }}
                  onTap={onPublish}
                  propagate={false}
                  style={{ cursor: 'pointer' }}
                  src={iconPublish} 
                />
                <Icon 
                  whileTap={{ scale: 0.9 }}
                  onTap={onDelete}
                  propagate={{ tap: false }}
                  style={{ cursor: 'pointer' }}
                  src={iconTrash} 
                />
              </Flex>
            )
            : like.status === 'success' 
                ? (
                  <Flex gap='10px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                    <NormalText
                      style={{
                        color: '#272727',
                        wordBreak: 'normal'
                      }}
                    >{like.value.count}</NormalText>
                    <Icon 
                      whileTap={isConnected ? { scale: 0.9 } : {}}
                      onTap={async () => {
                        if (isConnected) {
                          await like.updateValue()
                        }
                      }}
                      propagate={false}
                      style={{ cursor: 'pointer' }}
                      src={like.value.voted ? iconHeartFill : iconHeart} 
                    />
                  </Flex>
                )
                : (
                  <Flex gap='10px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                    <Icon src={iconHeartLoading} />
                  </Flex>
                )
        }
      </Flex>
    </ListItemContainer>
  )
}

export const Playlist = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState('')
      , [isLocal, setLocal] = useState(true)
      , [isHide, setHide] = useState(false)

  const showModalWindow = useContext(ModalWindowContext)

  const { isConnected } = Redstone.useApp()
      
  const playlist = Redstone.useList('playlist', { 
    cache: 600000, 
    stas: isConnected ? !isLocal : true,
    self: isConnected ? isLocal : false,
    once: isConnected ? !isLocal : true,
    watch: false
  })

  const publicPlaylist = Redstone.useList('playlist', { 
    stas: true,
    self: false,
    once: true,
    load: false
  })

  const confirm = useStasPay() 
      , cert = Redstone.useCertificate('playlist')

  const tracks = useMemo(() => {
    const tracks = formatPianoData(playlist.value)

    const regexpSearch = new RegExp(
      search
        .replace(/\*/gi, '\\*')
        .replace(/\+/gi, '\\+')
        .replace(/\?/gi, '\\?')
        .replace(/\$/gi, '\\$')
        .replace(/\^/gi, '\\^')
        .replace(/\[/gi, '\\[')
        .replace(/\]/gi, '\\]')
        .replace(/\(/gi, '\\(')
        .replace(/\)/gi, '\\)')
        .replace(/\{/gi, '\\{')
        .replace(/\}/gi, '\\}')
        .replace(/\//gi, '\\/')
        .replace(/\\/gi, '\\\\'), 
      'gi'
    )
    
    const _tracks = Object.values(
      tracks.reduce((ctx, track) => {
        const hash = `${track.notes.join('')}${track.title}${track.address}`
        ctx[hash] = track
        return ctx
      }, {})
    )
    .filter(track => `${track.title} ${track.address}`.match(regexpSearch))

    return _tracks
  }, [playlist.value, search])

  return isHide 
          ? (
            null
          )
          : (
            <ShadowContainer
              name='shadow'
              onTap={e => {
                if (e.target.getAttribute('name') !== 'shadow') return
                onClose()
              }}
            >
              <Container>
                <Flex gap='10px' style={{ width: '100%' }}>
                  <StyleСontrols>
                    <Input
                      placeholder='Track name' 
                      value={search}
                      onChange={({ target: { value } }) => setSearch(value)}
                    />
                    <Icon src={iconSearch} />
                  </StyleСontrols>
                  {
                    isConnected 
                      ? (
                        <Flex gap='10px' direction='row' style={{ width: '100%' }}>
                          <NormalText style={{ color: '#272727' }}>Filter tracks:</NormalText>
                          <NormalText 
                            onTap={() => setLocal(s => !s)}
                            style={{ textDecoration: 'underline' }}
                          >{isLocal ? 'local' : 'public'}</NormalText>
                        </Flex>
                      )
                      : null
                  }
                  <ListContainer
                    style={
                      playlist.status === 'success' && tracks.length !== 0
                        ? {}
                        : {
                          padding: '30px',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }
                    }
                  >
                    {
                      playlist.status === 'success' && tracks.length !== 0
                        ? (
                          tracks.map((track, key) => (
                            <ListItem 
                              key={key} 
                              style={
                                tracks.length - 1 === key 
                                  ? {
                                    border: 'none'
                                  }
                                  : {}
                              }
                              isLocal={isConnected && isLocal}
                              track={track} 
                              onSelect={() => {
                                onSelect({
                                  ...track,
                                  isLocal: isConnected && isLocal
                                })
                                onClose()
                              }}
                              onDelete={async () => {
                                setHide(true)
                                const isDelete = await showModalWindow({
                                    title: 'Delete',
                                    description: 'You want delete this track?',
                                    buttons: [{ 
                                      label: 'Yes',
                                      response: true
                                    }, { 
                                      label: 'No',
                                      response: false
                                    }]
                                })
                                setHide(false)
                                
                                if (isDelete) {
                                  const isDeleted = await playlist.updateValue(track, '')
                                
                                  if (!isDeleted) {
                                    setHide(true)
                                    await showModalWindow({
                                        title: 'Delete',
                                        description: 'Track is not deleted',
                                        buttons: [{ 
                                          label: 'Ok',
                                          response: true
                                        }]
                                    })
                                    setHide(false)
                                  }
                                }
                              }}
                              onPublish={async () => {
                                const _cert = await cert.recheckValue()

                                if (!_cert) {
                                    alert('Error')
                                }

                                if (_cert.value === 0) {
                                    const commission = await cert.getCommission()
                                        , isConfirm = await confirm(commission)

                                    if (!isConfirm) {
                                        return
                                    }
                                    await cert.updateValue(100)
                                }

                                const commission = await playlist.getCommission()
                                const isConfirm = await confirm(commission)

                                if (!isConfirm) {
                                  return
                                }

                                const data = `${track.title.slice(0, 60).replace(/,/gi, '').replace(/"/, '')},${track.date},${track.notes.join(',')}`
                                const isAddPublicTrack = await publicPlaylist.addValue(data)
                              
                                if (isAddPublicTrack) {
                                  setHide(true)
                                  setLocal(false)
                                  await showModalWindow({
                                      title: 'Public',
                                      description: 'Track published successfully',
                                      buttons: [{ 
                                        label: 'Ok',
                                        response: true
                                      }]
                                  })
                                  setHide(false)
                                } else {
                                  setHide(true)
                                  await showModalWindow({
                                      title: 'Public',
                                      description: 'Track is not published',
                                      buttons: [{ 
                                        label: 'Ok',
                                        response: true
                                      }]
                                  })
                                  setHide(false)
                                }
                              }}
                            />
                          )) 
                        ) 
                        : (
                          <Flex gap='10px'>
                            <Icon src={iconNote} />
                            <NormalText style={{ width: 'auto' }}>
                              {
                                playlist.status === 'success' && tracks.length === 0 
                                  ? 'Emply' 
                                  : 'Loading...'
                              }
                            </NormalText>
                          </Flex>
                        )
                    }
                  </ListContainer>
                </Flex>
              </Container>
            </ShadowContainer>
          )
}