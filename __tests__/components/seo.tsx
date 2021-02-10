import React from "react";
import Header from "../../src/components/layout/header";
import {render, fireEvent, screen} from '@testing-library/react';
import { useStaticQuery } from "gatsby";
import SEO from "../../src/components/layout/seo";
import { Helmet } from "react-helmet";

const mockTitle = "Home | Lucferbux";
const mockTitleMeta = "Home"
const mockDescription = "Lucferbux Personal Webpage";
const mockAuthor = "@lucferbux";
const mockUrl = "https://lucferbux.dev";

describe('SEO component', () => {
	beforeAll(() => {
	    (useStaticQuery as jest.Mock).mockReturnValue({
	        site: {
	            siteMetadata: {
                    title: `Lucferbux`,
                    description: `Lucferbux Personal Webpage`,
                    author: `@lucferbux`,
                    siteUrl: `https://lucferbux.dev`,
	            },
	        },
	    });
	});
	
	it("renders seo correctly", () => {
		

		render(<SEO title="Home" />);
		const helmet = Helmet.peek();

		expect(helmet.title).toBe(mockTitle);
		expect(helmet.metaTags).toEqual(
			expect.arrayContaining([
				{
					name: `description`,
					content: mockDescription,
				  },
				  {
					property: `og:title`,
					content: mockTitleMeta,
				  },
				  {
					property: `og:description`,
					content: mockDescription,
				  },
				  {
					property: `og:type`,
					content: `website`,
				  },
				  {
					name: `twitter:card`,
					content: `summary`,
				  },
				  {
					name: `twitter:creator`,
					content: "",
				  },
				  {
					name: `twitter:title`,
					content: mockTitleMeta,
				  },
				  {
					name: `twitter:description`,
					content: mockDescription,
				  },
				  {
					name: 'apple-mobile-web-app-status-bar-style',
					content: 'default'
				  },
			])
		);
	});
});