import React from "react";

import {render, screen} from '@testing-library/react';
import { Post } from "../../../data/model/post";
import PostCard from "../PostCard";

const postMock: Post = {
  title: "Como apps pueden rastrearte incluso después de desinstalarlas",
  title_en: "How apps can track you even after uninstalling them",
  description: "Aquí hablamos de algunas de las técnicas que siguen librerías para determinar si un usuario desinstalado sus aplicaciones. Una de ellas es lanzar “pings” mediante push notifications esperando respuesta.",
  description_en: "Here we talk about some of the techniques that libraries follow to determine if a user uninstalled their applications. One of them is to launch “pings” through push notifications waiting for a response.",
  link: "https://www.seguridadapple.com/2018/10/como-apps-pueden-rastrearte-incluso.html",
  image: "https://firebasestorage.googleapis.com/v0/b/lucferbux-web-page.appspot.com/o/patentImage%2F1552982863789_patent_image?alt=media&token=a7f1b2da-84d3-45a6-bf43-9b2c0e1c5935",
  date: new Date(),
  loaded: false,
}

const mockLoading = "/images/animations/loading.gif";

test('Card Title', () => {
  const { getByText } = render(<PostCard post={postMock} />)
  expect(getByText(postMock.title_en)).toBeInTheDocument();
})

test('Card Description', () => {
  const { getByText } = render(<PostCard post={postMock} />)
  expect(getByText(postMock.description_en)).toBeInTheDocument();
})


test('Test Img', () => {
  render(<PostCard post={postMock} />)
  expect(screen.getByAltText("News Header Image")).toHaveAttribute("src", postMock.image);
})

test('Test Loading Img', () => {
  render(<PostCard post={postMock} />)
  expect(screen.getByAltText("News Header Loading")).toHaveAttribute("src", mockLoading);
})


test('External link', () => {
  render(<PostCard post={postMock} />)
  expect(screen.getByRole("link")).toHaveAttribute("href", postMock.link);
})

