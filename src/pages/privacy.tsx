import React from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import PrivacySection from "../components/terms/privacySection"


const Privacy = () => {
  return (
    <Layout>
      <SEO title="Privacy" themeColor="#007789" themeColorDark="#2b2830" meta={[]}/>
      <PrivacySection/>
    </Layout>
  )
}

export default Privacy;
