/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import React from "react"
import { FirebaseAppProvider } from "reactfire"

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
  if (typeof window === "undefined") return <p></p>
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      {element}
    </FirebaseAppProvider>
  )
}

export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    <noscript key="noscript">
      <style>
        {`

        html {
          height: 100%;
        }

        body {
            background: linear-gradient(180deg, #c98c31 0%, #eabe7d 100%) !important;
            height: 100%;
            margin: 0;
            background-repeat: no-repeat;
            background-attachment: fixed;
        }

        .no-script {
          max-width: 1234px;
          margin: 0 auto;
          padding: 200px 30px;
          display: grid;
          text-align: center;
          justify-item: center;
        }

        .title-fallback{
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-clip: text;
          -webkit-background-clip: text;
          font-weight: bold;
          font-size: 50px;
          @media (max-width: 450px) {
            font-size: 48px;
          }
        }

        .description-fallback {
          font-size: 22px;
          line-height: 130%;
          color: #fff;
        }

        `}
      </style>

      <div className="no-script">
          <h1 className="title-fallback">Please, enable javascript</h1>
          <p className="description-fallback">This page need javascript to run, it doesn't collect any usage nor navigation, please, enable javascript</p>
      </div>
    </noscript>,
  ])
}
