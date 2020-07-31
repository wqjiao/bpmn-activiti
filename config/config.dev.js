import {hash} from './constants';

export default {
    outputPath: `./dist/${hash}`, // 打包路径增加hash值层，方便删除
    publicPath: `https://raw.githubusercontent.com/wqjiao/bpmn-activiti/master/public/${hash}/`,
    define: {
        'process.env.apiUrl': 'https://raw.githubusercontent.com/wqjiao/bpmn-activiti',
        'process.env.assetsUrl':
            'https://raw.githubusercontent.com/wqjiao/bpmn-activiti/master/public', // 资源地址
    },
    hash: true,
};
