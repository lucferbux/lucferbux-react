import React from "react"
import styled from "styled-components"
import { Work } from "../../data/model/work";
import { themes } from "../styles/ColorStyles";



interface ResumeeCardRowProps {
    work: Work;
}

const ResumeeCardRow = (props: ResumeeCardRowProps) => {

    const { work } = props;
    

    return (
        <Wrapper>
            <Icon src={`/images/icons/${work.icon}.svg`} alt="icon image"/>
            <TextWrapper>
                <Title>{work.name_en}</Title>
                <Date>{work.job_en}</Date>
                <Description>{work.description_en}</Description>
            </TextWrapper>
        </Wrapper>
    )


}

export default ResumeeCardRow;

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 34px auto;
    width: 100%;
    padding: 10px;
    column-gap: 16px;
`

const Icon = styled.img`
    border-radius: 50%;
    box-shadow: rgb(255 255 255 / 20%) 0px 0px 0px 0.5px;
    width: 32px;
    height: 32px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50px;
`

const TextWrapper = styled.div`
    display: grid;
    gap: 8px;
`

const Title = styled.p`
    font-style: normal;
    font-size: 15px;
    line-height: 18px;
    color: ${themes.light.text1};
    font-weight: 600;
    margin: 0px;

    @media (prefers-color-scheme: dark) {
        color: ${themes.dark.text1};
    }
`

const Date = styled.p`
    font-style: normal;
    font-size: 13px;
    line-height: 14px;
    color: ${themes.light.text2};
    font-weight: 400;
    margin: 0px;

    @media (prefers-color-scheme: dark) {
        color: ${themes.dark.text2};
    }
`

const Description = styled.p`
    font-style: normal;
    font-size: 15px;
    line-height: 18px;
    color: ${themes.light.text1};
    font-weight: normal;
    margin: 0px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (prefers-color-scheme: dark) {
        color: ${themes.dark.text1};
    }

    @media (max-width: 450px) {
        -webkit-line-clamp: 5;
    }

    @media (max-width: 380px) {
        -webkit-line-clamp: 7;
    }

 `