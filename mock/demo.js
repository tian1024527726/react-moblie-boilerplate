import mockjs from 'mockjs';

const { Random } = mockjs;
// 使用 Mock
// demo: http://mockjs.com/examples.html
/**
 * "string|1-10": "★" => "string": "★★★★★★"
 * "number|1-100": 100 => "number": 19
 */
mockjs.mock(/apiName/, 'post', {
	'list': [{
		'id|+1': 1,
		'email': '@email',
		'name': '@name',
		'age|10-40': 0,
		'address': () => (Random.province() + Random.city() + Random.county()),
	}],
});

