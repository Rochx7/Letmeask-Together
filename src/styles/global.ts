import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`


body {
    background-color: ${props => props.theme.colors.background};
    color: ${(props => props.theme.colors.text)};
    transition: background-color 0.3s, color 0.3s;
}

#page-room header{
    border-bottom:1px solid ${(props => props.theme.colors.secondary)};
}
      
`