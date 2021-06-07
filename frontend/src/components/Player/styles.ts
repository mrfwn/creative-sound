import { shade } from "polished";
import styled, { css } from "styled-components";

export const Container = styled.div`
  margin-top: 27px;
  width: 75%;
  height: 92%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  
`;

export const Band = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

interface InstrumentType {
  active: boolean;
}
export const Instrument = styled.div<InstrumentType>`
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #444;
  width: 15%;
  height: 80%;
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
  cursor: pointer;
  border-radius: 4px;
  strong{
    margin-top: 15px;
  }
`;

export const TimeLine = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
`;

export const Trail = styled.div`
  width: 100%;
  overflow-x: scroll;
  height: 17%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const Beat = styled.div`
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #444;
  width: 7%;
  height: 100%;
  border: 1px solid;
  border-color: #fff #000;
  strong{
    
  }
  input{
    margin-top: 15px;
    
    width: 40%;
  }
  svg {
    margin-top: 15px;
    cursor: pointer;
  }
  background-color: #fff;
`;


