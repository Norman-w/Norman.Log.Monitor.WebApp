import styled from "styled-components";
import {SearchBar} from "./SearchBar.tsx";
import {SearchResultList} from "./SearchResultList.tsx";
import {LogRecord4View} from "../../Model/LogRecord4View.ts";
import {Log} from "../../Model/Log.ts";
import {LogType} from "../../Model/LogType.ts";
import {LogLayer} from "../../Model/LogLayer.ts";
import {ConfigProvider} from "antd";

const SearchPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  width: 100%;
  height: 100%;
    `;

const mockupLog : Log = new Log();
mockupLog.Id = '1111';
mockupLog.Type = LogType.Bug;
mockupLog.Layer = LogLayer.Business;
mockupLog.Module = 'Module1';
mockupLog.Summary = 'Summary1';
mockupLog.Detail = 'Detail1';

const mockupLog2 : Log = new Log();
mockupLog2.Id = '2222';
mockupLog2.Type = LogType.Success;
mockupLog2.Layer = LogLayer.Data;
mockupLog2.Module = 'Module2';
mockupLog2.Summary = 'Summary2';
mockupLog2.Detail = 'Detail2';

const mockupSearchResult:LogRecord4View[] = [
    {
        Log: mockupLog,
        Display:true, Filtered:true,
    },
    {
        Log: mockupLog2,
        Display:true, Filtered:true,
    }
];

export const SearchPage = () => {
     return (
        <SearchPageContainer>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#003f3f',
                        borderRadius: 3,
                        colorTextBase:'#f9f9f9',
                        colorBgContainer: '#242424',
                    },
                }}
            >
                <h3 style={{width:'100%', textAlign:"left", borderBottom:'3px solid grey', paddingLeft:20}}>Search Page</h3>
                <SearchBar></SearchBar>
                <SearchResultList logs={mockupSearchResult}></SearchResultList>
            </ConfigProvider>
        </SearchPageContainer>
    );
}