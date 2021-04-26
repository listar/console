const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "./src/index.html"),
    filename: "./index.html"
});
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, "./src/plugin.js"),
    output: {
        path: path.join(__dirname, "dist/"),
        filename: "[name].[hash:6].js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        htmlWebpackPlugin, new CleanWebpackPlugin()
    ],
    resolve: {
        extensions: [".js", ".jsx", "ts", "tsx"]
    },
    devServer: {
        port: 8080
    }
};
