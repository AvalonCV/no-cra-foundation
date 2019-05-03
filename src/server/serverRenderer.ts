import { Request, Response } from 'express';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from './../app/App';

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
				<script src="js/client.js" defer="defer"></script>
			</body>
			</html>
		`;
		res.status(200).send(response);
	};
}
