import styled, { css } from "styled-components";
import { shade } from "polished";
export const Container = styled.ul`
  margin-top: 20px;
  width: 100%;
  height: 100%;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #444;
    width: 100%;
    height: 10%;
    & + li {
      margin-top: 15px;
    }
  }
`;

interface FileInfoProps {
  active: boolean;

}

export const FileInfo = styled.div<FileInfoProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  
  border-radius: 4px;
 
  strong {
    font-size: 20px;
  }
  ${props =>
    !props.active ?
      css`
        background-color: #fff;
        &:hover {
          background-color: ${shade(0.1, '#fff')};
        }
      `
      : css`
        background-color: #00a000;
        &:hover {
          background-color: ${shade(0.1, '#00a000')};
        }
    `}  
`;



