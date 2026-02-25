import React from "react";

import {render, screen} from '@testing-library/react';
import { News } from "../../../data/model/news";
import NewsCard from "../NewsCard";

const newsMock: News = {
  title: "Stack Sms",
  title_en: "Sms Stack",
  description: "Stack Sms es un proyecto en el que llevamos trabajando ya un tiempo en Ideas Locas. El concepto básico es dar capacidades parecidas a la pila TCP en la red Gsm a través de Sms. Además podemos encapsular otros protocolos encima de Stack Sms para que se ajuste a multiples necesidades.Fran, un compañero de Ideas Locas ha escrito un excelente artículo explicando un poco el protocolo, como descargarlo y casos de uso útiles. Es un proyecto bastante singular y merece la pena echarle un ojo, así que os animo a leer el artículo e ir al github oficial.",
  description_en: "Stack Sms is a project that we have been working on at Ideas Locas for a while. The basic concept is to give capabilities similar to the TCP stack in the GSM network through SMS. In addition we can encapsulate other protocols on top of Stack Sms to suit multiple needs.Fran, a workmate from Ideas Locas has written an excellent article explaining the protocol a bit, how to download it and useful use cases. It is a rather unique project and worth checking out, so I encourage you to read the article and go to the official Github.",
  url: "http://www.elladodelmal.com/2019/03/antiddos-para-todos-los-dispositivos.html?m=1",
  image: "https://firebasestorage.googleapis.com/v0/b/lucferbux-web-page.appspot.com/o/introImage%2F1552158957110_intro_image?alt=media&token=fcea2db6-4c38-4aa3-bb0d-5198a4fa554b",
  timestamp: new Date(),
  loaded: false,
}

const mockLoading = "/images/animations/loading.gif";

test('Card Title', () => {
  const { getByText } = render(<NewsCard news={newsMock} />)
  expect(getByText(newsMock.title_en)).toBeInTheDocument();
})


test('Test Img', () => {
  render(<NewsCard news={newsMock} />)
  expect(screen.getByAltText("News Header Image")).toHaveAttribute("src", newsMock.image);
})

test('Test Loading Img', () => {
  render(<NewsCard news={newsMock} />)
  expect(screen.getByAltText("News Header Loading")).toHaveAttribute("src", mockLoading);
})


test('External link', () => {
  render(<NewsCard news={newsMock} />)
  expect(screen.getByRole("link")).toHaveAttribute("href", newsMock.url);
})

