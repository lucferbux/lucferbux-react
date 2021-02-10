import '@testing-library/jest-dom'

import React from "react"
import Header from "../../src/components/layout/header"
import {render, fireEvent, screen} from '@testing-library/react'


test('check the logo', () => {
  render(<Header />)
  expect(screen.queryByAltText("Logo Icon")).toBeInTheDocument();
})