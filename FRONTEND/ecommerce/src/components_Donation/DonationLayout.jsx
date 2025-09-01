import { Container } from "react-bootstrap"
import styled from "styled-components"

const DonationContainer = styled(Container)`
  padding: 20px;
  min-height: 100vh;
`

const DonationLayout = ({ children }) => {
  return <DonationContainer fluid>{children}</DonationContainer>
}

export default DonationLayout

