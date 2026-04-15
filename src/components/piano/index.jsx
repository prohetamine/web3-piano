/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'
import formatPianoData from './format-piano-data.js'
import Keyboard from './keyboard.jsx'
import MiniPiano from './mini-piano.jsx'
import texture from './../../assets/texture.png'
import PlayerMenu from './player-menu.jsx'
import Menu from './menu.jsx'
import usePiano from './use-piano.js'
import * as Redstone from '@prohetamine/redstone'
import { ModalWindowContext } from '../modal-window/index.jsx'

const ContainerPiano = styled.div`
    container-type: inline-size;
    max-width: 1280px;
    width: 100%;
    overflow: hidden;
    background: #1f1f1f;   
    position: relative; 
    border: none;
    @media (min-width: 1280px) {
        border: 1px solid #000000;
    }
`

const Navigation = styled.div`
    background: linear-gradient(180deg, rgba(84, 83, 83, 0.6) 0%, rgba(84, 83, 83, 0.6) 1%, rgba(31, 31, 31, 0.6) 1%, rgba(33, 33, 33, 0.6) 85.1%, rgba(42, 42, 42, 0.6) 88.94%, rgba(40, 40, 40, 0.6) 91.35%, rgba(28, 28, 28, 0.6) 94.23%, rgba(24, 24, 24, 0.6) 99%, rgba(23, 23, 23, 0.6) 100%), linear-gradient(89deg, rgba(0, 0, 0, 0.5) 0%, rgba(72, 72, 72, 0.5) 50%, rgba(0, 0, 0, 0.5) 100%), url(${texture});
    background-size: cover;
    width: 100%;
    min-height: 10cqw;
    height: calc(100% - 250px);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
`

const LoadingBody = styled.div`
    width: 100cqw;
    height: 100%;
    background: #000000cc;
    position: absolute;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Loading = () => (
    <LoadingBody>
        <svg width="60" height="20" viewBox="0 0 120 30">
            <circle cx="30" cy="15" r="10" fill="#9e8a00">
                <animate attributeName="cy" from="15" to="15" dur="0.6s" begin="0s" repeatCount="indefinite" values="15;5;15" keyTimes="0;0.5;1"></animate>
            </circle>
            <circle cx="60" cy="15" r="10" fill="#9e8a00">
                <animate attributeName="cy" from="15" to="15" dur="0.6s" begin="0.2s" repeatCount="indefinite" values="15;5;15" keyTimes="0;0.5;1"></animate>
            </circle>
            <circle cx="90" cy="15" r="10" fill="#9e8a00">
                <animate attributeName="cy" from="15" to="15" dur="0.6s" begin="0.4s" repeatCount="indefinite" values="15;5;15" keyTimes="0;0.5;1"></animate>
            </circle>
        </svg>
    </LoadingBody>
)

const Piano = ({ trackData, onPlaylist }) => {
    const { chainId, index, isLocal } = trackData || {}

    const showModalWindow = useContext(ModalWindowContext)

    const [offsetKeyboard, setOffsetKeyboard] = useState(0.5)
        , [isUpload, setUpload] = useState(false)
        , keydown = useRef()
        , piano = usePiano(keydown, setOffsetKeyboard)

    const { address, isConnected, open } = Redstone.useApp()

    const track = Redstone.useReadListItem('playlist', { chainId, index }, { 
            cache: 60000, 
            load: !!trackData?.chainId, 
            watch: false, 
            stas: !isLocal, 
            once: !isLocal, 
            self: !!isLocal, 
            paymentAddress: '0xbcfA1b80C39F9a378b12b257934BE409Bc93eC60' 
        })
        , playlist = Redstone.useList('playlist', { 
            cache: 60000, 
            load: false, 
            stas: false, 
            self: true,
            paymentAddress: '0xbcfA1b80C39F9a378b12b257934BE409Bc93eC60' 
        })
        , [isUploadTrack, setUploadTrack] = useState(false)
    
    const author = Redstone.useNote(`author`, { value: address, self: true, selfRead: true, cache: 0 })
        , [isUploadAuthorName, setUploadAuthorName] = useState(false)

    const [isSelectTrack, setSelectTrack] = useState(false)
    
    const [{ notes = [] }] = track.value ? formatPianoData([track.value]) : [{}]

     useEffect(() => {
        if (notes && notes.length > 0 && track.status === 'success') {
            setSelectTrack(true)
            piano.onUpload(notes)
        }
    }, [track.status, notes.join('')])

    useEffect(() => {
        if (trackData === null) {
            setSelectTrack(false)
            piano.onClean()
        }
    }, [trackData])

    return (
        <ContainerPiano>
            {
                isConnected && ((track.status !== 'success' && trackData !== null) || isUpload || isUploadAuthorName)
                    ? (
                        <Loading />
                    )
                    : null
            }
            <Navigation>
                <PlayerMenu 
                    {...piano}
                    isUpload={isConnected && !isUploadTrack}
                    isSelect={isSelectTrack}
                    onStop={() => {
                        setSelectTrack(false)
                        piano.onClean()
                    }} 
                    onUpload={async () => {
                        if (!isConnected) {
                            open()
                            return
                        }

                        setUploadTrack(true)
                        const [isConfirm, name] = await showModalWindow({
                            title: 'Track',
                            description: 'Write track name',
                            input: {
                                placeholder: 'Track name ...',
                            }, 
                            buttons: [{ 
                                label: 'Ok',
                                response: true
                            }, { 
                                label: 'Cancel',
                                response: false
                            }]
                        })
                        
                        if (!isConfirm || name.length === 0) {
                            setUploadTrack(false)
                            return
                        }
                        
                        setUpload(true)
                        const track = piano.getRecord()
                            , data = `${name.slice(0, 60).replace(/,/gi, '').replace(/"/, '')},${Date.now()},${track}`
                        
                        const isUpload = await playlist.addValue(data)
                        
                        if (isUpload) {
                            piano.onClean()
                        } else {
                            await showModalWindow({
                                title: 'Error',
                                description: 'Upload track to blockchain',
                                buttons: [{ 
                                    label: 'Ok',
                                    response: true
                                }]
                            })
                        }
                        setUploadTrack(false)
                        setUpload(false)
                    }}
                    onPlaylist={onPlaylist}
                />
                <MiniPiano 
                    isPlay={piano.isPlay}
                    value={offsetKeyboard} 
                    onChange={data => setOffsetKeyboard(data)}
                />
                <Menu 
                    isUpload={isConnected && !isUploadAuthorName && author.status === 'success'}
                    onProfile={async () => {
                        if (!isConnected) {
                            open()
                            return
                        }
                        
                        setUploadAuthorName(true)
                        const [isConfirm, name] = await showModalWindow({
                            title: 'Author',
                            description: 'Write author name',
                            input: {
                                placeholder: 'My name is ...',
                                value: author.value
                            }, 
                            buttons: [{ 
                                label: 'Ok',
                                response: true
                            }, { 
                                label: 'Cancel',
                                response: false
                            }]
                        })
                        
                        if (isConfirm && name !== author.value) {
                            const isUpload = await author.updateValue(name) 
                            if (!isUpload) {
                                await showModalWindow({
                                    title: 'Error',
                                    description: 'Upload author name to blockchain',
                                    buttons: [{ 
                                        label: 'Ok',
                                        response: true
                                    }]
                                })
                            }
                        }
                        setUploadAuthorName(false)
                    }} 
                />
            </Navigation>
            <Keyboard 
                offset={offsetKeyboard} 
                keydownRef={keydown} 
                onKeydown={key => piano.addNote(offsetKeyboard, key, Date.now())} 
            />
        </ContainerPiano>
    )
}

export default Piano