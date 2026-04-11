import { styled } from 'styled-components'
import * as Redstone from '@prohetamine/redstone'
import texture from './assets/big-texture.png'
import loader from './assets/loader.svg'
import trash from './assets/trash.svg'
import close from './assets/close.svg'
import emplyLike from './assets/empty-like.svg'
import fillLike from './assets/fill-like.svg'
import { memo } from 'react'

const Body = styled.div`
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(31, 31, 31, 0.6) 1%, rgba(42, 42, 42, 0.6) 78.59%, rgba(23, 23, 23, 0.6) 100%), linear-gradient(89deg, rgba(0, 0, 0, 0.5) 0%, rgba(72, 72, 72, 0.5) 50%, rgba(0, 0, 0, 0.5) 100%), url(${texture});
    background-size: cover;
    position: absolute;
    left: 0px; 
    top: 0px;
    z-index: 7777;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Loader = styled.div`
    background-image: url("${loader}");
    background-size: cover;
    width: 7vw;
    height: 7vw;
`

const OverflowPlaylist = styled.div`
    overflow: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow-y: auto;
`

const TrackWrapper = styled.div`
    padding: 2vw;
    background: #ffffff14;
    border: 0.2vw solid #ffffff27;
    box-shadow: 0px 0px 1vw 0px #ffffff1a;
    border-radius: 1vw;
    margin-left: 8vw;
    margin-right: 8vw;
    margin-top: 2vw;
    display: flex;
    justify-content: space-between;
`

const EmptyMarginBugOrder = styled.div`
    margin-bottom: 2vw;
`

const Meta = styled.div`
    width: 65vw;
`

const Title = styled.div`
    color: #ffffff;
    font-size: 1.6vw;
    font-weight: 600;
    margin-bottom: 5px;
`

const LikeOverflow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.2vw;
`

const LikeCounter = styled.div`
    color: #ffffff;
    font-size: 1.7vw;
    font-weight: 500;
`

const Author = styled.div`
    color: #a8a8a8;
    font-size: 1.1vw;
`

const Navigation = styled.div`
    display: flex;
    gap: 2.4vw;
`

const Button = styled.div`
    width: 4vw;
    height: 4vw;
    background-image: url("${props => props.src}");
    background-size: cover;
    cursor: pointer;
`

const CloseButton = styled.div`
    background: #ffffff14;
    background-size: cover;
    border: 0.2vw solid #ffffff27;
    box-shadow: 0px 0px 1vw 0px #ffffff1a;
    border-radius: 1vw;
    display: flex;
    justify-content: space-between;
    position: absolute;
    right: 2vw;
    top: 2vw;
`

const Track = memo(({ track, onSelect, onDelete }) => {
    const { isConnected, open } = Redstone.useApp()
        , author = Redstone.useReadNote(`author`, { address: track.address, value: track.address, self: true, selfRead: true, cache: 10000 })
        , like = Redstone.useCounter(`like`, {
            cache: 10000,
            copyId: track.index,
            switching: true
        })

    return (
        <TrackWrapper style={{ order: track.hasEdit ? -(Number(like.value.count)+999999999) : -like.value.count }} onClick={onSelect}>
            <Meta>
                <Title>{track.title.length > 38 ? track.title.slice(0, 35) + '...' : track.title}</Title>
                <Author>{author.value.length > 42 ? author.value.slice(0, 39) + '...' : author.value}</Author>
            </Meta>
            <Navigation>
                {
                    track.hasEdit 
                        ? (
                            <Button 
                                onClick={onDelete} 
                                src={trash} 
                            />
                        )
                        : (
                            <LikeOverflow>
                                <LikeCounter>{like.value.count}</LikeCounter>
                                <Button 
                                    onClick={async e => {
                                        e.stopPropagation()
                                        if (!isConnected) {
                                            open()
                                            return 
                                        }
                                        
                                        const isUpdate = await like.updateValue()
                                        if (!isUpdate) {
                                            alert('Error track like')
                                        }
                                    }} 
                                    src={like.value.voted ? fillLike : emplyLike} 
                                />
                            </LikeOverflow>
                        )
                }
            </Navigation>
        </TrackWrapper>
    )
})

const Playlist = ({ tracks, onDelete, onClose, onSelect }) => {
    return (
        <Body>
            <CloseButton onClick={onClose}>
                <Button src={close} />
            </CloseButton>
            {
                tracks.length > 0
                    ? (
                        <OverflowPlaylist>
                            {
                                tracks.map(track => (
                                    <Track 
                                        key={track.index} 
                                        onDelete={e => {
                                            e.stopPropagation()
                                            onDelete(track)
                                        }}
                                        onSelect={() => {
                                            const data = track.notes

                                            const notes = []
                                            for (let i = 0; i < data.length; i += 3) {
                                                const offset = data[i] === '' ? data[i] : parseFloat(data[i])
                                                    , key = parseInt(data[i+1])
                                                    , time = (parseInt(data[i+2]) || 0)

                                                notes.push([offset, key, time])
                                            }

                                            onSelect(notes)
                                        }}
                                        track={track}
                                    />
                                ))
                            }
                            <EmptyMarginBugOrder />
                        </OverflowPlaylist>
                    )
                    : (
                        <Loader className='loader' />
                    )
            }
        </Body>
    )
}

export default Playlist