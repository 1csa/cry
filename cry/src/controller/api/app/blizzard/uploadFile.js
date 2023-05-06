const Base = require('../../../base');
const fs = require('fs');
const request = require('request');

module.exports = class extends Base {

  constructor(props) {
    super(props)
  }

  async parseExcelUploadAction() {
    console.log('post params', this.post(), this.get());
    const files = this.file('fileStream');
    // console.log('files', files);
    var req = request.post(this.get(), function (err, resp, body) {
      if (err) {
        this.json({
          status: 'failed',
          msg: `上传失败,url:${this.get()}`
        })
      } else {
        this.json({
          status: 'success',
          data: body
        })
        console.log('返回请求' + body);
      }
    });

    var form = req.form();

    form.append('file', fs.createReadStream(files.path), {
      filename: files.name,
      contentType: 'application/vnd.ms-excel'
    });
    form.append('connectBusiness', JSON.stringify(this.post('connectBusiness')));
  }
};
