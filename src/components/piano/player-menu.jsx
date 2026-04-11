import styled from 'styled-components'
import { ControllButton, RecordButton, PlaylistButton, StopButton, TrashButton, UploadButton } from './styles.jsx'

const Body = styled.div`
  width: 15cqw;
  height: 4cqw;
  background: #101010;
  border-radius: 0.8cqw;
  box-sizing: border-box;
  padding: 0.25cqw;
  overflow: hidden;
  display: flex;
  gap: 0.25cqw;
  margin-right: 2cqw;
`

const PlayerMenu = ({ 
  isSelect,
  isUpload,
  isPlay, 
  isRecord, 
  isPause, 
  limit, 
  onPlay, 
  onPause, 
  onClean, 
  onStop, 
  onRecord, 
  onUpload, 
  onPlaylist 
}) => (
  <Body>
    {
      (isPlay || isPause || isSelect)
        ? (
          <StopButton 
            disabled={isPlay}
            onClick={onStop} 
          />
        )
        : (!isRecord && limit !== 4800)
            ? (
              <TrashButton onClick={onClean} />
            )
            : (
              <RecordButton 
                isRecord={isRecord}
                onClick={() => {
                  if (!isPlay) {
                    onRecord()
                  }
                }}
              />
            )
    }
    <ControllButton
      disabled={isRecord || limit === 4800}
      isPlay={isPlay}
      onPlay={onPlay}
      onPause={async () => {
        if (!isPause) {
          onPause()
        } else {
          onPlay()
        }
      }}
    />
    {
      (!isRecord && limit !== 4800 && !isSelect)
        ? (
          <UploadButton 
            disabled={!isUpload}
            onClick={onUpload}
          />
        )
        : (
          <PlaylistButton 
            disabled={isRecord} 
            onClick={onPlaylist} 
          />
        )
    }
  </Body>
)

export default PlayerMenu