import React from "react";

import {render, screen} from '@testing-library/react';
import { Project } from "../../../data/model/project";
import ProjectCard from "../ProjectCard";

const projectMock: Project = {
  title: "Como apps pueden rastrearte incluso después de desinstalarlas",
  title_en: "How apps can track you even after uninstalling them",
  description: "Aquí hablamos de algunas de las técnicas que siguen librerías para determinar si un usuario desinstalado sus aplicaciones. Una de ellas es lanzar “pings” mediante push notifications esperando respuesta.",
  description_en: "Here we talk about some of the techniques that libraries follow to determine if a user uninstalled their applications. One of them is to launch “pings” through push notifications waiting for a response.",
  link: "https://www.seguridadapple.com/2018/10/como-apps-pueden-rastrearte-incluso.html",
  tags: "Python, Angular",
  date: new Date(),
  version: "1.0.2",
  featured: false,
}

const mockFeatured = "FEATURED";

test('Card Title', () => {
  const { getByText } = render(<ProjectCard project={projectMock} />)
  expect(getByText(projectMock.title_en)).toBeInTheDocument();
})

test('Card Description', () => {
  const { getByText } = render(<ProjectCard project={projectMock} />)
  expect(getByText(projectMock.description_en)).toBeInTheDocument();
})

test('Card Version', () => {
  const { getByText } = render(<ProjectCard project={projectMock} />)
  expect(getByText(projectMock.version)).toBeInTheDocument();
})

test('Featured filled', () => {
  const { getByText } = render(<ProjectCard project={projectMock} captionText={mockFeatured} />)
  expect(getByText(mockFeatured)).toBeInTheDocument();
})

test('Featured empty', () => {
  render(<ProjectCard project={projectMock} />)
  expect(screen.getByTestId("caption").textContent).toBe("");
})


test('External link', () => {
  render(<ProjectCard project={projectMock} />)
  expect(screen.getByRole("link")).toHaveAttribute("href", projectMock.link);
})

