import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "./src/index.html"),
    filename: "./index.html"
});

export default {
    mode: 'development',
    entry: path.join(__dirname, "./src/index.js"),
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
