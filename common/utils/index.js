import Loading from '@/components/Loading';
import { Toast } from 'yzt-rui';

let IS_LOADING = false;

export const getUniqID = () => Math.random().toString(36).substr(2, 6);

export const fileToImgsrc = (fileinput) => {
	return new Promise((resolve, reject) => {
		let files = fileinput.files,
			img = new Image();
		console.log(files);
		if (window.FileReader) {
			let reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = function (e) {
				img.src = this.result;

				if (img.complete) {
					resolve(compress(img));
				} else {
					img.onload = () => {
						const imgBase64Data = compress(img);
						resolve(imgBase64Data);
						img = null;
					};
				}
				// resolve(this.result);
				reader = null;
			}
		} else if (window.Blob && files[0] instanceof Blob) {
			let mpImg = new MegaPixImage(files[0]);
			mpImg.render(img);
			img.onload = function (e) {
				resolve(this.src);
				img = null;
			};
		}
	});
};

export const fillDate = (str) => {
	let arr = str.split('');
	arr.splice(4, 0, '-');
	arr.splice(-2, 0, '-');
	return arr.join('');
};

export const fillZero = (n) => {
	return n < 10 ? '0' + n : '' + n;
};

export const getToday = (type) => {
	let d = new Date();
	let y = d.getFullYear(), M = d.getMonth() + 1, day = d.getDate();
	if (type) {
		return y + type + fillZero(M) + type + fillZero(day);
	}
	return y + fillZero(M) + fillZero(day);
};

export const getTheDay = (num, type) => {
	let d = new Date();
	let time = d.getTime();
	let D = new Date(time - (num) * (24 * 3600 * 1000));
	let y = D.getFullYear(), M = D.getMonth() + 1, day = D.getDate();
	if (type) {
		return y + type + fillZero(M) + type + fillZero(day);
	}
	return y + fillZero(M) + fillZero(day);
};

export const getNow = (type) => {
	let d = new Date();
	let y = d.getFullYear(), M = d.getMonth() + 1, day = d.getDate(), h = d.getHours(), m = d.getMinutes(),
		s = d.getSeconds();
	if (type) {
		return y + type + fillZero(M) + type + fillZero(day) + ':' + fillZero(h) + type + fillZero(m) + type + fillZero(s);
	}
	return y + fillZero(M) + fillZero(day) + fillZero(h) + fillZero(m) + fillZero(s);
};

export const toQS = (params) => {
	let paramsList = [];
	for (let key in params) {
		paramsList.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
	}
	return paramsList.join("&");
};

export const addQS = (host, url, params) => {
	if (!/^(:?https?:\/)?\//.test(url)) {
		url = host + url;
	}
	const query = toQS(params);
	return query ? url + (url.indexOf("?") ? "?" : "&") + toQS(params) : url;
};


export const formatMoney = (money, n) => {
	if (!money || !(money = parseFloat(money))) {
		money = 0;
	}
	n = n > 0 && n <= 3 ? n : 2;
	money = money.toFixed(n);
	let l = money.split(".")[0].split("").reverse();
	let r = money.split(".")[1];
	let t = "";
	for (let i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
};

export const unformatMoney = num => {
	if (num) {
		return num.replace(/,/g, "");
	}
	return num;
};


export const dateFormatting = (fmt, dateStr) => {
	if (!dateStr) return '';
	dateStr = dateStr.replace(new RegExp("-", "g"), "\/");
	var date = new Date(dateStr);
	var o = {
		"M+": date.getMonth() + 1,                 //月份
		"d+": date.getDate(),                    //日
		"h+": date.getHours(),                   //小时
		"m+": date.getMinutes(),                 //分
		"s+": date.getSeconds(),                 //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds()             //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

/**
 * antd的分页对象转换成请求api的分页对象
 * antd page obj => request api page obj
 * @param current
 * @param pageSize
 */
export const antdPToReqApiP = ({ current, pageSize }) => ({
	currentPage: current,
	pageSize,
});

/**
 * 服务端响应api分页对象转换成 antd的分页对象
 * response api page obj => antd page obj
 * @param current
 * @param size
 * @param total
 */
export const resApiPToAntP = ({ current, size, total }) => ({
	current,
	pageSize: size,
	total,
});

/**
 * obj对象转化成select元素的option结构，
 * {0: '无效'} => [{value: '0', text: '无效'}]
 * @param obj
 * @returns {Array}
 */
export const objToOptions = (obj, hasNull) => {
	const options = Object.keys(obj).map(key => ({
		value: key,
		text: obj[key],
	}));
	hasNull && options.unshift({
		value: '',
		text: '请选择'
	});
	return options;
};

/**
 * 根据data， 创建select元素的option选项
 * @param data
 * @param value
 * @param text
 * @param hasNull
 */
export const createOptions = ({ data, value, text }, hasNull = false) => {
	const options = data.map(item => ({
		value: item[value],
		text: item[text],
	}));
	hasNull && options.unshift({
		value: '',
		text: '请选择',
	});
	return options;
};

export const pipePromise = promiseArr => () => new Promise((resolve, reject) => {
	const promiseChain = promiseArr.reduce(
		(lastPromise, promise) => () => lastPromise().then(promise).catch(err => {
			reject(err);
			return Promise.reject(err);
		}),
		() => Promise.resolve(),
	);
	promiseChain().then(resolve);
});

export const composePromise = promiseArr => () => new Promise((resolve, reject) => {
	const promiseChain = promiseArr.reduceRight(
		(lastPromise, promise) => () => lastPromise().then(promise).catch(err => {
			reject(err);
			return Promise.reject(err);
		}),
		() => Promise.resolve(),
	);
	promiseChain().then(resolve);
});

if (Object.defineProperty) {
	Object.defineProperty(Promise, 'pipe', {
		value: pipePromise,
		enumerable: false,
		configurable: false,
		writable: false,
	});
	Object.defineProperty(Promise, 'compose', {
		value: composePromise,
		enumerable: false,
		configurable: false,
		writable: false,
	});
} else {
	Promise.pipe = pipePromise;
	Promise.compose = composePromise;
}

/**
 * 获取数据类型
 * @param {*} obj
 */
export const getType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}

/**
 * 设置小数位数，默认number类型，允许传string类型
 * @param {*} params
 * @param {*} num
 */
export const formatNumber = (params, num = 2) => {
  let data;
  if (getType(params) === 'number') {
    data = params;
  } else if (getType(params) === 'string') {
    if (params === "null") data = parseFloat(0);
  } else if (getType(params) === 'null' || getType(params) === 'undefined') {
    data = parseFloat(0);
  } else {
    throw new Error(`请传入number和string数据类型`);
  }

  return data.toFixed(num);
}

/**
 * 显示loading
 */
export const showLoading = () => {
  if (!IS_LOADING) {
    Loading.show();
    IS_LOADING = true;
  }
}

/**
 * 隐藏loading
 */
export const hideLoading = () => {
  IS_LOADING = false;
  Loading.hide();
}

/**
 * 显示的toast
 * @param {*} message
 */
export const showToast = (message, time) => {
  Toast.show(message, time || 2);
}

