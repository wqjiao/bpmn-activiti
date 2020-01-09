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
                icon: 'icon-quanxianshezhi',
                path: '/bpmn',
                routes: [
                    {
                        path: '/bpmn/processManage',
                        name: 'processManage', // 流程管理
                        component: './Bpmn/ProcessManage/index',
                    },
                    {
                        path: '/bpmn/processManage/edit/:id',
                        name: 'processDesign', // 流程设计
                        hideInMenu: true,
                        component: './Bpmn/ProcessManage/ProcessDesign',
                    },
                    {
                        path: '/bpmn/processTrace',
                        name: 'processTrace', // 流程跟踪
                        component: './Bpmn/ProcessTrace/index',
                    },
                ],
            },
            // ReactSlick
            {
                name: 'reactslick',
                icon: 'icon-quanxianshezhi',
                path: '/reactslick',
                routes: [
                    {
                        path: '/reactslick/carousel',
                        name: 'carousel', // antd 面板式
                        component: './ReactSlick/AntdCarousel/index',
                    },
                    {
                        path: '/reactslick/asnavfor',
                        name: 'asnavfor', // 缩略图+组件
                        component: './ReactSlick/AsNavFor/index',
                    },
                    {
                        path: '/reactslick/custompag',
                        name: 'custompag', // 面板式
                        component: './ReactSlick/CustomPag/index',
                    },
                ],
            },
            // react-lazyload
            {
                name: 'reactLazy',
                icon: 'icon-quanxianshezhi',
                path: '/reactLazy',
                component: './ReactLazy/index',
                // routes: [
                //     {
                //         path: '/reactLazy/',
                //         name: 'reactLazy',
                //         component: './ReactSlick/AntdCarousel/index',
                //     },
                // ],
            },
            {
                component: '404',
            },
        ],
    },
];
