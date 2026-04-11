/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import sleep from 'sleep-promise'

const limit = 4800

const usePiano = (keydown, OffsetKeyboard) => {
    const [isRecord, _setRecord] = useState(false)
    const [track, setTrack] = useState([])
    const [prevOffset, setPrevOffset] = useState(0)
    const [prevTime, setPrevTime] = useState(0)
    const [isPlay, setPlay] = useState(false)
    const [isUpload, setUpload] = useState(false)
    const isPauseRef = useRef(false)
    const cancelRef = useRef(false)

    useEffect(() => {
        if (isRecord) {
            cancelRef.current = false
            isPauseRef.current = false
            setTrack([])
            setPrevOffset(0)
            setPrevTime(Date.now())
            setPlay(false)
        }
    }, [isRecord])

    useEffect(() => {
        if (isUpload && track.length !== 0) {
            setUpload(false)
            onPlay()
        }
    }, [isUpload, track])

    const onRecord = () => _setRecord(r => !r)

    const addNote = (offset, key, time) => {
        if (isPlay || !isRecord) {
            return
        }
        
        const _offset = parseFloat(offset)
        
        setTrack(t => [
            ...t,
            prevOffset !== _offset
                ? _offset || 0
                : prevOffset === 0 ? 0 : '',
            key,
            time - prevTime
        ])
        setPrevOffset(_offset)
        setPrevTime(time)
    }

    const onPlay = async () => {
        if (isPlay) return

        if (isPauseRef.current) {
            setPlay(true)
            isPauseRef.current = false
            return
        }

        setPlay(true)
        const _track = track.flat()

        for (let x = 0; x < _track.length; x += 3) {
            if (cancelRef.current) {
                cancelRef.current = false
                setPlay(false)
                return
            }

            for (;isPauseRef.current;) {
                if (cancelRef.current) {
                    isPauseRef.current = false
                    cancelRef.current = false
                    setPlay(false)
                    return
                }
                await sleep(1)
            }

            const offset    = _track[x]
                , key       = _track[x+1]
                , timeout   = _track[x+2]
            
            if (offset !== '') {
                OffsetKeyboard(offset)
            }

            if (keydown.current && !isPauseRef.current && !cancelRef.current) {
                await sleep(timeout)
                keydown.current(key)   
            }
        }
        await sleep(1000)
        setPlay(false)
    }

    const onPause = () => {
        setPlay(false)
        isPauseRef.current = true
    }

    const onStop = () => {
        cancelRef.current = true
        isPauseRef.current = false
        setPlay(false)
    }

    const onClean = () => {
        cancelRef.current = true
        isPauseRef.current = false
        setTrack([])
        setPlay(false)
    }

    const onUpload = track => {
        cancelRef.current = false
        isPauseRef.current = false
        setPrevOffset(0)
        setPrevTime(Date.now())
        setTrack(track)
        setUpload(true)
    }

    const _track = track.flat().join(',')

    const getRecord = () => _track

    const isPause = isPauseRef.current

    return {
        isRecord,
        isPlay, 
        isPause, 
        limit: limit - _track.length, 
        onPlay, 
        onPause, 
        onStop, 
        onRecord,
        addNote, 
        getRecord, 
        onClean,
        onUpload
    }
}

export default usePiano