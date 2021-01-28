/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import React from "react"
import { FirebaseAppProvider } from "reactfire"
import "firebase/firestore"
import styled from "styled-components"

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API,
  authDomain: "lucferbux-web-page.firebaseapp.com",
  databaseURL: "https://lucferbux-web-page.firebaseio.com",
  projectId: "lucferbux-web-page",
  storageBucket: "lucferbux-web-page.appspot.com",
  messagingSenderId: "304684761756",
  appId: "1:304684761756:web:9b9b520ab849a3b554e359",
  measurementId: "G-MEASUREMENT_ID",
}

export const wrapRootElement = ({ element }) => {
  if (typeof window === "undefined")return (<p>Loading...</p>)
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      {element}
    </FirebaseAppProvider>
  )
}

const Padding = styled.div`
  height: 1200px;
`


const ContentWrapper = styled.div`
  max-width: 1234px;
  margin: 0 auto;
  padding: 200px 30px;
  display: grid;
  grid-template-columns: 360px auto;

  @media (max-width: 750px) {
    grid-template-columns: auto;
    justify-content: center;
    padding: 150px 20px 290px;
    gap: 60px;
  }
`
