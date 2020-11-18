// --no-ignore
export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            {path: '/user', redirect: '/user/login'},
            {path: '/user/login', name: 'login', component: './User/Login'},
            {
                component: '404',
            },
        ],
    },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes: [
            {path: '/', redirect: '/bpmn/processManage'},
            // BPMN
            {
                name: 'bpmn',
                icon: 'icon-liuchengtu',
                path: '/bpmn',
                routes: [
                    {
                        name: 'processManage', // 流程管理
                        path: '/bpmn/processManage',                        
                        component: './Bpmn/ProcessManage',
                    },
                    {
                        name: 'processDesign', // 流程设计
                        path: '/bpmn/processManage/edit/:id',
                        component: './Bpmn/ProcessManage/ProcessDesign',
                        hideInMenu: true,
                    },
                    {
                        name: 'processTrace', // 流程跟踪
                        path: '/bpmn/processTrace',
                        component: './Bpmn/ProcessTrace',
                    },
                    },
                ],
            },
            // ReactSlick
            {
                name: 'reactslick',
                icon: 'icon-pingfenmoban',
                path: '/reactslick',
                routes: [
                    {
                        path: '/reactslick/carousel',
                        name: 'carousel', // antd 面板式
                        component: './ReactSlick/AntdCarousel',
                    },
                    {
                        path: '/reactslick/asnavfor',
                        name: 'asnavfor', // 缩略图+组件
                        component: './ReactSlick/AsNavFor',
                    },
                    {
                        path: '/reactslick/custompag',
                        name: 'custompag', // 面板式
                        component: './ReactSlick/CustomPag',
                    },
                ],
            },
            // react-lazyload
            {
                name: 'reactLazy',
                icon: 'icon-ziduan',
                path: '/reactLazy',
                component: './ReactLazy',
            },
            {
                component: '404',
            },
        ],
    },
];
