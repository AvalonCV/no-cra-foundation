import webpack from 'webpack';
import { Request, Response } from 'express';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from './../app/App';

// Or use 'webpack.compilation.Asset' ?
type Assets = string | [] | {};
interface CompilationWithName extends webpack.compilation.Compilation {
	name?: string;
}

// This function makes server rendering of asset references consistent with different webpack chunk/entry configurations
// https://github.com/webpack/webpack-dev-middleware#server-side-rendering
const normalizeAssets: (assets: Assets) => string[] = (assets: Assets) => {
	if (typeof assets === 'object' && assets !== null) {
		return Object.values(assets);
	} else {
		return Array.isArray(assets) ? assets : [assets];
	}
};

const getWebpackScriptAssets = (res: Response) => {
	const assets: string[] = [];
	const webpackStats: webpack.Stats[] = res.locals.webpackStats.stats;

	webpackStats
		.filter(element => {
			const { compilation }: { compilation: CompilationWithName } = element;
			return compilation.name === 'client';
		})
		.forEach(element => {
			for (let asset in element.compilation.assets) {
				normalizeAssets(asset).forEach(value => {
					value.endsWith('js') && assets.push(value);
				});
			}
		});

	return assets.map(path => `<script type="text/javascript" src="${path}" defer></script>`).join('\n');
};

export default function serverRenderer() {
	return function(_req: Request, res: Response, _next: any) {
		const body = ReactDOMServer.renderToString(React.createElement(App));
		const response = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
				<meta name="theme-color" content="#000000">

				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css" />

				<title>Test</title>
			</head>
			<body>
				<div class="main_root" id="root">${body}</div>
				${getWebpackScriptAssets(res)}
			</body>
			</html>
		`;
		res.status(200).send(response);
	};
}
