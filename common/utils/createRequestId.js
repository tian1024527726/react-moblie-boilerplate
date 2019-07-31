import Base64 from 'crypto-js/enc-base64'
import MD5 from 'crypto-js/md5'

export default () => 'I_' + Base64.stringify(MD5('' + new Date().valueOf()));
