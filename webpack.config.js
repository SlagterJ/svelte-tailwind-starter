const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const sveltePath = path.join(__dirname, "node_modules", "svelte");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  entry: {
    bundle: [path.join(__dirname, "src", "index.js")],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
      filename: "index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
  resolve: {
    alias: {
      svelte: sveltePath,
    },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].[id].js",
    clean: true, // Clean the dist/ directory each time the project builds
  },
  devServer: {
    hot: false, // Disable hot reloading here as Svelte3 doesn't support it (yet)
    port: 3000,
  },
  module: {
    rules: [
      // ***** JAVASCRIPT *****
      {
        test: /\.(?:svelte|m?js)$/,
        include: [path.join(__dirname, "src"), path.dirname(sveltePath)],
        exclude: /node_modules/,
        use: "babel-loader",
      },
      // ***** SVELTE *****
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            hotReload: true,
            compilerOptions: {
              // Enable devtools if the node_env is development
              dev: mode === "development",
            },
          },
        },
      },
      // ***** STYLES *****
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      // ***** FILES *****
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
};
