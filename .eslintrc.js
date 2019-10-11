/**
 * 其他规则可自行添加，规则详情如下
 * es6规则详情地址：https://eslint.org/docs/rules/
 * react规则详情地址：https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
 * */
module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: ['eslint:recommended', 'plugin:react/recommended'], //默认用推荐配置
    env: {
        browser: true,
        es6: true,
        node: false,
        commonjs: true,
        jquery: true,
    },
    globals: {
        process: false, //一些全局变量，按照自己项目设置
        __dirname: false,
        c3ImgBrowser: 'writable',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            arrowFunctions: true,
            classes: true,
            modules: true,
            defaultParams: true,
        },
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        'no-multiple-empty-lines': [2, {max: 2, maxEOF: 3, maxBOF: 3}],
        'no-irregular-whitespace': [
            2,
            {skipStrings: true, skipComments: true, skipTemplates: true},
        ],
        'react/prefer-es6-class': 2,
        'no-multi-spaces': 2,
        'no-unused-vars': 2,
        'no-redeclare': 2,
        'no-console': 1,
        'no-var': 2,
        indent: 0,
        'no-unreachable': 2,
        //关闭专门的react规则
        'react/no-find-dom-node': 0, //有时候还是要用findDOMNode的
        'react/no-did-mount-set-state': 0, //有时候还是要在didMount里用setState
        'react/no-did-update-set-state': 0, //有条件控制的话也是能用的
        'react/no-string-refs': 0, //refs这个东西有时候也是需要的
        'react/prop-types': 0, //这个以后可以规范下
    },
};
