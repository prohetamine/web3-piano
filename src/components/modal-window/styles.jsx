/* eslint-disable react-refresh/only-export-components */
import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'center'};
  gap: ${props => props.gap || '0px'};
`

export const ShadowContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: rgba(47, 47, 47, 0.75);
  position: fixed;
  z-index: 99999;
  left: 0px;
  top: 0px;
`

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  border-radius: 12px;
  padding: 24px 20px;
  background: #fff;
  max-width: 300px;
  width: 100%;
`

export const StyleСontrols = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  border: 1px solid #d9d9d9;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 12px 15px;
  box-sizing: border-box;
  width: 100%;
`

export const Title = styled.div`
  width: 100%;
  font-family: "Inter";
  font-weight: 500;
  font-size: 18px;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`

export const NormalText = styled(motion.div)`
  font-family: "Inter";
  font-weight: 400;
  font-size: 18px;
  color: #272727;
  word-break: break-word;
`

export const Author = styled.div`
  font-family: "Inter";
  font-weight: 500;
  font-size: 13px;
  color: #767676;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`

export const Input = styled.input`
  font-family: "Inter";
  font-weight: 400;
  font-size: 18px;
  color: #000;
  margin: 0px;
  padding: 0px;
  border: none;
  background: #f5f5f500;
  width: 100%;
`

export const Button = styled(motion.div)`
  padding: 12px 15px;
  background: linear-gradient(180deg, #f5f5f5 0%, #f2f2f2 100%);
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-family: "Inter";
  font-weight: 400;
  font-size: 18px;
  cursor: pointer;

  &:hover,:active {
    background: linear-gradient(180deg, #f2f2f2 0%, #f5f5f5 100%);
  }
`

export const Icon = styled(motion.div)`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background-image: url("${props => props.src}");
`

export const ListContainer = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  overflow: hidden;
  overflow-y: scroll;
  max-height: calc(80vh - 141px);
  width: 100%;
  box-sizing: border-box;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  
  &::-webkit-scrollbar {
    width: 12px;
  }
`

export const ListItemContainer = styled(motion.div)`
  border-bottom: 1px solid #e3e3e3;
  background: #f5f5f5;
  padding: 12px 15px;
`