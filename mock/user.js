import mockjs from 'mockjs';
import userApi from '@/api/user';

mockjs.mock(userApi.getUserInfo, 'post', { // eslint-disable-line
	"requestId": "I_puSLKyIVIfk70lKU/sMlZQ==",
	"responseCode": "000000",
	"responseData": {
		"userName": "颜一波",
		"eMail": "18868814352@163.com",
		"telephone": 18868814352,
		"gender": "male"
	},
	"responseMessage": "处理成功",
})
