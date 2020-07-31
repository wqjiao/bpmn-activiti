// Change theme plugin

import MergeLessPlugin from 'antd-pro-merge-less';
import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import path from 'path';
// const SftpAfterWebpack = require('sftp-after-webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
import {hash} from './constants';

function getModulePackageName(module) {
    if (!module.context) return null;

    const nodeModulesPath = path.join(__dirname, '../node_modules/');
    if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
        return null;
    }

    const moduleRelativePath = module.context.substring(nodeModulesPath.length);
    const [moduleDirName] = moduleRelativePath.split(path.sep);
    let packageName = moduleDirName;
    // handle tree shaking
    if (packageName.match('^_')) {
        // eslint-disable-next-line prefer-destructuring
        packageName = packageName.match(/^_(@?[^@]+)/)[1];
    }
    return packageName;
}

export default config => {
    // pro 和 开发环境再添加这个插件
    if (process.env.APP_TYPE === 'site' || process.env.NODE_ENV !== 'production') {
        // 将所有 less 合并为一个供 themePlugin使用
        const outFile = path.join(__dirname, '../.temp/ant-design-pro.less');
        const stylesDir = path.join(__dirname, '../src/');

        config.plugin('merge-less').use(MergeLessPlugin, [
            {
                stylesDir,
                outFile,
            },
        ]);

        config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
            {
                antDir: path.join(__dirname, '../node_modules/antd'),
                stylesDir,
                varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
                mainLessFile: outFile, //     themeVariables: ['@primary-color'],
                indexFileName: 'index.html',
                generateOne: true,
                lessUrl: 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js',
            },
        ]);
    }

    // 打包前删除本地 dist 包
    config.plugin('clean-webpack-plugin').use(CleanWebpackPlugin, [
        {
            verbose: true,
            cleanOnceBeforeBuildPatterns: [path.join(process.cwd(), 'dist')],
        },
    ]);

    // if (process.env.UMI_ENV === 'beta') {
    //     config.plugin('sftp-webpack').use(SftpAfterWebpack, [
    //         {
    //             host: '',
    //             user: '',
    //             password: '',
    //             port: '',
    //             localPath: `dist/${hash}`,
    //             remotePath: '',
    //         },
    //     ]);
    // }

    // if (process.env.UMI_ENV === 'dev') {
    //     config.plugin('sftp-webpack').use(SftpAfterWebpack, [
    //         {
    //             host: '',
    //             user: '',
    //             password: '',
    //             port: '',
    //             localPath: `dist/${hash}`,
    //             remotePath: '',
    //         },
    //     ]);
    // }
    // optimize chunks
    config.optimization
        .runtimeChunk(false) // share the same chunks across different modules
        .splitChunks({
            chunks: 'async',
            name: 'vendors',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendors: {
                    test: module => {
                        const packageName = getModulePackageName(module);
                        if (packageName) {
                            return ['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0;
                        }
                        return false;
                    },
                    name(module) {
                        const packageName = getModulePackageName(module);

                        if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
                            return 'viz'; // visualization package
                        }
                        return 'misc';
                    },
                },
            },
        });
};
