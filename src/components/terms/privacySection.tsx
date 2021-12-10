import React from "react"
import styled from "styled-components"
import { H1, H2, MediumText } from "../styles/TextStyles"
import { themes } from "../styles/ColorStyles"
import WaveTerms from "../backgrounds/WaveTerms"

const PrivacySection = () => {
  return (
    <Wrapper>
      <WaveTerms />
      <ContentWrapper>
        <TextWrapper>
          <Title>Privacy Policy</Title>
          <Description>
            Lucas Fernandez built the Lucferbux App app as a Free app. This SERVICE is provided
            by at no cost and is intended for use as is.
          </Description>
          <Description>
            This page is used to inform visitors regarding my policies with the
            collection, use, and disclosure of Personal Information if anyone
            decided to use my Service.
          </Description>
          <Description>
            If you choose to use my Service, then you agree to the collection
            and use of information in relation to this policy. The Personal
            Information that I collect is used for providing and improving the
            Service. I will not use or share your information with anyone except
            as described in this Privacy Policy.
          </Description>
          <Description>
            The terms used in this Privacy Policy have the same meanings as in
            our Terms and Conditions, which are accessible at Lucferbux App
            unless otherwise defined in this Privacy Policy.
          </Description>
          <Description>
            <Subtitle>Information Collection and Use</Subtitle>
          </Description>
          <Description>
            For a better experience, while using our Service, I may require you
            to provide us with certain personally identifiable information. The
            information that I request will be retained on your device and is
            not collected by me in any way.
          </Description>
          <Description>
            <Subtitle>Log Data</Subtitle>
          </Description>
          <Description>
            I want to inform you that whenever you use my Service, in a case of
            an error in the app I collect data and information (through
            third-party products) on your phone called Log Data. This Log Data
            may include information such as your device Internet Protocol (“IP”)
            address, device name, operating system version, the configuration of
            the app when utilizing my Service, the time and date of your use of
            the Service, and other statistics.
          </Description>
          <Description>
            <Subtitle>Cookies</Subtitle>
          </Description>
          <Description>
            Cookies are files with a small amount of data that are commonly used
            as anonymous unique identifiers. These are sent to your browser from
            the websites that you visit and are stored on your device's internal
            memory.
          </Description>
          <Description>
            This Service does not use these “cookies” explicitly. However, the
            app may use third-party code and libraries that use “cookies” to
            collect information and improve their services. You have the option
            to either accept or refuse these cookies and know when a cookie is
            being sent to your device. If you choose to refuse our cookies, you
            may not be able to use some portions of this Service.
          </Description>
          <Description>
            <Subtitle>Service Providers</Subtitle>
          </Description>
          <Description>
            I may employ third-party companies and individuals due to the
            following reasons:
          </Description>
          <ul>
            <li>To facilitate our Service;</li>
            <li>To provide the Service on our behalf;</li>
            <li>To perform Service-related services; or</li>
            <li>To assist us in analyzing how our Service is used.</li>
          </ul>
          <Description>
            I want to inform users of this Service that these third parties have
            access to their Personal Information. The reason is to perform the
            tasks assigned to them on our behalf. However, they are obligated
            not to disclose or use the information for any other purpose.
          </Description>
          <Description>
            <Subtitle>Security</Subtitle>
          </Description>
          <Description>
            I value your trust in providing us your Personal Information, thus
            we are striving to use commercially acceptable means of protecting
            it. But remember that no method of transmission over the internet,
            or method of electronic storage is 100% secure and reliable, and I
            cannot guarantee its absolute security.
          </Description>
          <Description>
            <Subtitle>Links to Other Sites</Subtitle>
          </Description>
          <Description>
            This Service may contain links to other sites. If you click on a
            third-party link, you will be directed to that site. Note that these
            external sites are not operated by me. Therefore, I strongly advise
            you to review the Privacy Policy of these websites. I have no
            control over and assume no responsibility for the content, privacy
            policies, or practices of any third-party sites or services.
          </Description>
          <Description>
            <Subtitle>Children’s Privacy</Subtitle>
          </Description>
          <Description>
            I do not knowingly collect personally identifiable information from
            children. I encourage all children to never submit any personally
            identifiable information through the Application and/or Services. I
            encourage parents and legal guardians to monitor their children's
            Internet usage and to help enforce this Policy by instructing their
            children never to provide personally identifiable information
            through the Application and/or Services without their permission. If
            you have reason to believe that a child has provided personally
            identifiable information to us through the Application and/or
            Services, please contact us. You must also be at least 16 years of
            age to consent to the processing of your personally identifiable
            information in your country (in some countries we may allow your
            parent or guardian to do so on your behalf).
          </Description>
          <Description>
            <Subtitle>Changes to This Privacy Policy</Subtitle>
          </Description>
          <Description>
            I may update our Privacy Policy from time to time. Thus, you are
            advised to review this page periodically for any changes. I will
            notify you of any changes by posting the new Privacy Policy on this
            page.
          </Description>
          <Description>This policy is effective as of 2021-12-10</Description>
          <Description>
            <Subtitle>Contact Us</Subtitle>
          </Description>
          <Description>
            If you have any questions or suggestions about my Privacy Policy, do
            not hesitate to contact me at lucasfernandezaragon@gmail.com.
          </Description>
        </TextWrapper>
      </ContentWrapper>
    </Wrapper>
  )
}

export default PrivacySection

const Wrapper = styled.div`
  overflow: hidden;
  @media (min-width: 2500px) {
    padding-bottom: 100px;
  }
`

const WaveStars = styled.div`
  position: absolute;
  width: 100%;
  background-position: center top;
  background-repeat: repeat;
  background-image: url("/images/backgrounds/stars.svg");
  height: 420px;
  top: 0px;
  display: none;

  @media (prefers-color-scheme: dark) {
    display: block;
  }
`

const ContentWrapper = styled.div`
  max-width: 1234px;
  margin: 0 auto;
  padding: 140px 30px 30px 30px;

  @media (max-width: 750px) {
    padding: 150px 20px 290px;
    gap: 60px;
  }
`

const TextWrapper = styled.div`
  display: grid;
  gap: 10px;
`

const Title = styled(H1)`
  color: ${themes.light.text1};
  margin: 30px 0px 10px 0px;

  @media (prefers-color-scheme: dark) {
    color: ${themes.dark.text1};
  }
`

const Subtitle = styled(H2)`
  color: ${themes.light.text1};
  margin: 20px 0px 10px 0px;

  @media (prefers-color-scheme: dark) {
    color: ${themes.dark.text1};
  }
`

const Description = styled(MediumText)`
  color: ${themes.light.text1};

  @media (prefers-color-scheme: dark) {
    color: ${themes.dark.text1};
  }
`
