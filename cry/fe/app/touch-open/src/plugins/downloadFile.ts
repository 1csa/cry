import type { App } from 'vue';

const downloadFile = (hrefUrl:string, fileName: string) => {
    let downLoadLabel = document.createElement("a");
    downLoadLabel.setAttribute("href", hrefUrl);
    downLoadLabel.setAttribute("download", fileName);
    document.body.appendChild(downLoadLabel);
    downLoadLabel.click();
    URL.revokeObjectURL(downLoadLabel.href); // 释放URL 对象
    document.body.removeChild(downLoadLabel);
};

export const previewFile = (hrefUrl:string) => {
    const iframe = "<iframe width='100%' height='100%' src='data:application/pdf;base64," + hrefUrl + "'></iframe>"
    const x: any = window.open()
    x.document.open()
    x.document.write(iframe)
    x.document.close()
};

// 封装blob对象
function dataURLToBlob(base64Str:string, mimeTypeStr:string) {
    let bstr = window.atob(base64Str); // 解码 base-64 编码的字符串，base-64 编码使用方法是 btoa()
    let length = bstr.length;
    let u8arr = new Uint8Array(length); // 创建初始化为0的，包含length个元素的无符号整型数组
    while (length--) {
        u8arr[length] = bstr.charCodeAt(length); // 返回在指定的位置的字符的 Unicode 编码
    }
    return new Blob([u8arr], { type: mimeTypeStr }); // 返回一个blob对象
}

export const downloadFileByBase64 = (base64Str: string, fileName: string) => {
    if (!base64Str) {
        return;
    }
    const blob = dataURLToBlob(base64Str, "application/pdf")
    const hrefUrl = window.URL.createObjectURL(blob)
    downloadFile(hrefUrl, fileName)
};

export const downloadFileByFileFlow = (data: string, fileName: string) => {
    if (!data) {
        return;
    }
    const blob = new Blob([data], { type: "application/pdf" });
    const hrefUrl = window.URL.createObjectURL(blob); // 将文件流转化为一个文件地址
    downloadFile(hrefUrl, fileName)
};

const VueDownloadFile = {
    install: function (app: App) {
        app.config.globalProperties.$downloadFileByBase64 = downloadFileByBase64
        app.config.globalProperties.$downloadFileByFileFlow = downloadFileByFileFlow
    }
}

export default VueDownloadFile
