// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
    // 支持值为 Object 和 Array
    'POST /api/user/getUserInfo*': (req, res) => {
        // if (req.headers.authorization) {
        res.send({
            code: 200,
            data: {
                avatar:
                    'https://user-gold-cdn.xitu.io/2019/9/11/16d1bec29f3b3d38?imageView2/1/w/120/h/120/q/85/format/webp/interlace/1',
                dataAuthType: 0,
                delFlag: 0,
                enabled: 0,
                isDraft: 0,
                status: 0,
                uName: '某某某',
                phone: '18260358789',
                uname: 'jack',
                dataAuth: '1',
                dataAuthLabel: '系统内',
                institution: '1667d7b1-be3d-47CAaab4-96c7618af30d',
                institutionType: 1,
                institutionLabel: '巡逻鹰',
                institutionTypeLabel: 'GPS',
            },
        });
        // } else {
        //     res.send({
        //         code: 1001,
        //         data: null,
        //     });
        // }
    },
    // GET POST 可省略
    'GET /api/users': [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ],
    'POST /api/user/login': (req, res) => {
        const {password, account, type} = req.body;
        if (password === '123456' && account === '18220190425') {
            res.send({
                code: 200,
                type,
                token:
                    'eyJhbGciOiJIUzI1NiJ9.eyJpbnN0aXR1dGlvbiI6bnVsbCwiaWQiOiIxIiwiZXhwIjoxNTUzNDk4OTY0LCJpYXQiOjE1NTM0OTg5MDQsImFjY291bnQiOiIxODI2MDM1NjIzNiIsImp0aSI6ImI5YTkxNjdiLTM2NDYtNGQxZC1iYjBhLTUzY2YzN2NkYzYxMSIsInVzZXJuYW1lIjpudWxsfQ.LTotnYUNdY3zu-QmH2e0HXuFDnyUfVnnMo3-qFUaTSU',
            });
            return;
        }
        res.send({
            data: '',
            code: 4001,
            msg: '账户不存在',
        });
    },
    'POST /api/register': (req, res) => {
        res.send({status: 'ok', currentAuthority: 'user'});
    },
    'GET /api/500': (req, res) => {
        res.status(500).send({
            timestamp: 1513932555104,
            status: 500,
            error: 'error',
            message: 'error',
            path: '/base/category/list',
        });
    },
    'GET /api/404': (req, res) => {
        res.status(404).send({
            timestamp: 1513932643431,
            status: 404,
            error: 'Not Found',
            message: 'No message available',
            path: '/base/category/list/2121212',
        });
    },
    'GET /api/403': (req, res) => {
        res.status(403).send({
            timestamp: 1513932555104,
            status: 403,
            error: 'Unauthorized',
            message: 'Unauthorized',
            path: '/base/category/list',
        });
    },
    'GET /api/401': (req, res) => {
        res.status(401).send({
            timestamp: 1513932555104,
            status: 401,
            error: 'Unauthorized',
            message: 'Unauthorized',
            path: '/base/category/list',
        });
    },
};
