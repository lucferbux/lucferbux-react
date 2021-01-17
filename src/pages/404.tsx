import React, { useEffect } from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import { navigate } from "gatsby"

const NotFoundPage = () => {
  useEffect(() => {
    navigate('/');
  }, []);
  return null;
}

export default NotFoundPage
