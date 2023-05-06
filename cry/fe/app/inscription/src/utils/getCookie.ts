/**
 * 根据cookie name来获取指定的cookie
 */

 const getCookie =function(name: string): string | undefined {
	const regexp = new RegExp(`${name}=([^;]*)`, 'g');
	const cookie = document.cookie;
	
	let res: string | undefined = undefined;

	if (cookie.match(regexp)) {
		cookie.replace(regexp, function(p, p1) {
			res = unescape(p1);
			return p;
		})
	}
		
	 return res
 }

 export default getCookie;