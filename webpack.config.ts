import path from 'path';
import webpack from 'webpack';

// // type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
// // type MyWebpackConfiguration = Modify<
// // 	webpack.Configuration,
// // 	{
// // 		output: webpack.Output;
// // 		module: webpack.Module;
// // 	}
// // >;
interface CustomWebpackConfiguration extends webpack.Configuration {
	output: webpack.Output;
	module: webpack.Module;
	plugins: webpack.Plugin[];
}

export default function(_env: NodeJS.ProcessEnv, _argv: any): CustomWebpackConfiguration[] {
	const base: CustomWebpackConfiguration = {
		mode: 'development',
		output: {
			// path needs to be an ABSOLUTE file path
			path: path.resolve(process.cwd(), 'dist'),
			publicPath: '/'
		},
		resolve: {
			// Add '.ts' and '.tsx' as resolvable extensions.
			extensions: ['.ts', '.tsx', '.js', '.json']
		},
		module: {
			rules: [
				// All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
				{
					test: /\.tsx?$/,
					use: [
						{
							loader: 'ts-loader'
						}
					]
				}
			]
		},
		plugins: []
	};

	return [
		// server-specific configuration
		{
			...base,
			name: 'server',
			entry: ['./src/server/serverRenderer.ts'],
			target: 'node',
			output: {
				...base.output,
				filename: 'js/server.js',
				libraryTarget: 'commonjs2'
			}
		},
		{
			...base,
			name: 'client',
			entry: ['webpack-hot-middleware/client', './src/app/index.tsx'],
			target: 'web',
			output: {
				...base.output,
				filename: 'js/client.js'
			},
			plugins: [...base.plugins, new webpack.HotModuleReplacementPlugin()]
		}
	];
}
