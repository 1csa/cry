export default (value: string): boolean=> {
	return /^http(s?):\/\/.+$/.test(value);
}