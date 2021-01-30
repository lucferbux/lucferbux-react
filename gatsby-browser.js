/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// You can delete this file if you're not using it

import React from "react"
import { FirebaseAppProvider } from "reactfire"
import "firebase/firestore"

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
  if (typeof window === "undefined") return (<p></p>)
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      {element}
    </FirebaseAppProvider>
  )
}
