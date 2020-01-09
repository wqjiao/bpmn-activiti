import request from 'umi-request';
request.get('/api/v1/xxx?id=1');
// .then(function(response) {
//     console.log(response);
// })
// .catch(function(error) {
//     console.log(error);
// });
// 也可将 URL 的参数放到 options.params 里
request.get('/api/v1/xxx', {
    params: {
        id: 1,
    },
});
// .then(function(response) {
//     console.log(response);
// })
// .catch(function(error) {
//     console.log(error);
// });
