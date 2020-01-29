const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const glob = require("glob");
const WebpackProvideGlobalPlugin = require("webpack-provide-global-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

//main directory
const PATHS = {
  src: path.resolve(process.cwd(), "src"),
  dist: path.resolve(process.cwd(), "dist")
};

//pug directory
const PAGES_DIR_PUG = `${PATHS.src}/template/views/`;
const PAGES_PUG = fs
  .readdirSync(PAGES_DIR_PUG)
  .filter(fileName => fileName.endsWith(".pug"));

module.exports = {
  entry: [`${PATHS.src}/js/index.js`, `${PATHS.src}/scss/style.scss`],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/[name].[contenthash].js"
  },

  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  devtool: "source-map",

  devServer: {
    publicPath: "/",
    contentBase: "./",
    contentBase: "./",
    watchContentBase: true,
    // don't watch node_modules
    watchOptions: {
      ignored: /node_modules/
    },
    overlay: true
  },

  module: {
    rules: [
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: "jQuery"
          },
          {
            loader: "expose-loader",
            options: "$"
          }
        ]
      },
      {
        test: /\.js$/,
        //        include: path.resolve(__dirname, "src/js"),
        include: [
          path.resolve(__dirname, "src/js"),
          path.resolve("node_modules/swiper"),
          path.resolve("node_modules/dom7"),
          path.resolve("node_modules/ssr-window")
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage", // or "entry"
                  corejs: 3
                }
              ]
            ]
          }
        }
      },

      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, "src/scss"),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false
            }
          },

          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              plugins: [
                require("autoprefixer")({
                  overrideBrowserslist: ["last 2 versions"],
                  cascade: false
                })
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: "raw-loader"
      },

      {
        test: /\.pug$/,
        loader: "pug-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: "./css/[name].[contenthash].css",
      optimization: {
        splitChunks: {
          chunks: "all"
        }
      }
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/fonts",
        to: "./fonts"
      },
      {
        from: "./src/img",
        to: "./img"
      }
    ]),

    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i
    }),
    ...PAGES_PUG.map(
      page =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR_PUG}/${page}`,
          filename: `./${page.replace(/\.pug/, ".html")}`
        })
    )
  ]
};
