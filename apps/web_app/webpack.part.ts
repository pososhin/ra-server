import {Configuration, RuleSetRule, WatchIgnorePlugin, WebpackPluginInstance} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import {join} from "path";
import {tsRuleBase} from "../../webpack.common";

const webAppPlugins: WebpackPluginInstance[] = [
    new HtmlWebpackPlugin(),
    new WatchIgnorePlugin({
        paths: [join(__dirname, '..', 'apps', 'server')]
    }),
    new MiniCssExtractPlugin({
        // filename: '[name][contenthash].css',
        filename: '[name].css',
      }),
]
const tsRuleWebApp: RuleSetRule = {
    ...tsRuleBase,
    options: {
        configFile: join(__dirname, 'tsconfig.json')
    }
}
export const webAppConfig: Configuration = {
    entry: join(__dirname, 'src', 'index.tsx'),
    output: {
        path: join(__dirname, '..', '..', 'dist', 'web_app'),
        filename: 'bundle.js'
    },
    target: 'web',
    plugins: webAppPlugins,
    module: {
        rules: [tsRuleWebApp,
            { test: /\.(scss|css)$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader',
                //   {
                //     loader: 'sass-resources-loader',
                //     options: { resources: `./${PROJECT_DIR}src/css/var.scss` },
                //   },
                ],
              },
              { test: /\.(?:ico|gif|png|jpg|jpeg|mp3)$/i, type: 'asset/resource' },
              { test: /\.(woff(2)?|eot|ttf|otf|svg)$/i, type: 'asset/inline' },
        ]
    }
}