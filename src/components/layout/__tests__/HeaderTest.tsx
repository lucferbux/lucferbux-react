import React from "react";
import Header from "../header";
import {render, fireEvent, screen} from '@testing-library/react';


test('check the logo', () => {
  render(<Header />)
  expect(screen.queryByAltText("Logo Icon")).toBeInTheDocument();
})

test('check exact three links', () => {
  render(<Header />)
  expect(screen.getAllByRole("link").length).toEqual(4);

  expect(screen.getByText("News")).toBeInTheDocument();
  expect(screen.getByText("Projects")).toBeInTheDocument();
  expect(screen.getByText("Posts")).toBeInTheDocument();
})