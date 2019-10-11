export default {
    'POST //api/user/getMenuInfo*': (req, res) => {
        res.send({
            code: 200,
            data: [
                {
                    name: 'BPMN',
                    path: '/bpmn',
                    children: [
                        {
                            name: 'List',
                            path: '/bpmn/processManage',
                        },
                        {
                            name: 'Trace',
                            path: '/bpmn/processTrace',
                        },
                    ],
                },
                {
                    name: 'ReactSlick',
                    path: '/reactslick',
                    children: [
                        {
                            name: 'Carousel',
                            path: '/reactslick/carousel',
                        },
                        {
                            name: 'AsNavFor',
                            path: '/reactslick/asnavfor',
                        },
                        {
                            name: 'CustomPag',
                            path: '/reactslick/custompag',
                        },
                    ],
                },
            ],
        });
    },
};
