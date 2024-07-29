import styled from "styled-components";

const SearchBarContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    `;

export const SearchBar = () => {
    return (
        <SearchBarContainer>
            <input type="text" placeholder="Search..." />
            <button>Search</button>
        </SearchBarContainer>
    );
}