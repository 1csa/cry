import React, { useState, useEffect, useContext, useRef } from 'react';
import { Upload, message, Button } from 'antd';
import XLSX from 'xlsx';
import Iconfont from '@/components/Dumb/Iconfont';

const ONE_M_TO_BYTES: number = 1024 * 1024;
const MAX_FILE_SIZE: number = 10;

interface IUploaderParseExcelProps {
  handleExcelParsedData: (tableData: any[]) => void; // 解析完成数据之后返回给父组件
  handleFileInputRefs: (refs: any) => void; //
  tableColumnKey: any[];
}

const UploaderParseExcel: React.FC<IUploaderParseExcelProps> = ({
  handleExcelParsedData,
  tableColumnKey,
  handleFileInputRefs,
}) => {
  const uploadInput = useRef(null);
  // 获取column的对象key 数组转对象
  const formatTitleOrFileld = () => {
    const entozh = tableColumnKey.map((item, index) => {
      return {
        index,
        key: item.key,
      };
    });
    return entozh;
  };

  const handleImpotedJson = (jsonArr: any) => {
    const [header, ...tableBody] = jsonArr;
    const keysArr = formatTitleOrFileld();
    const len = header.length;

    // 稀疏数组补全empty项
    tableBody.forEach((item: any) => {
      for (let i = 0; i <= len - 1; i++) {
        item[i] = item[i] || '';
      }
    });
    const parsedExcelData = tableBody.map((ele: any) => {
      const newitem = {};
      ele.forEach((im: any, i: number) => {
        const newKey = keysArr[i].key;
        newitem[newKey] = im;
      });
      return newitem;
    });
    handleExcelParsedData && handleExcelParsedData(parsedExcelData.length ? parsedExcelData : []);
  };

  const beforeUpload = (file: any) => {
    if (file.size / ONE_M_TO_BYTES > MAX_FILE_SIZE) {
      message.warning('请上传小于10M的文件！');
    } else {
      const f = file;
      const reader = new FileReader();

      reader.onload = function(e) {
        const datas = e?.target?.result;
        // 解析datas
        const workbook = XLSX.read(datas, {
          type: 'binary',
        });

        // 是工作簿中的工作表的有序列表
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // 将工作簿对象转换为JSON对象数组
        const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

        handleImpotedJson(jsonArr);
      };
      reader.readAsBinaryString(f);
    }
  };

  const handleUpload = () => {
    // @ts-ignore
    beforeUpload(uploadInput?.current?.files[0]);
  };
  const handleFakeUpload = () => {
    // @ts-ignore
    uploadInput?.current?.click();
  };

  useEffect(() => {
    if (document) {
      /**
       * 监听input上传事件 在得到文件流之后 把input的ref回传到父组件
       * 并且解析文件转为json来在表格里显示
       */
      document.querySelector(`[name=uploadExcel]`)!.addEventListener('change', function(event) {
        // @ts-ignore
        if (event?.target && event?.target?.files) {
          handleFileInputRefs && handleFileInputRefs(uploadInput);
          handleUpload();
        }
      });
    }
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div className="fix-input-button">
        <input type="file" name="uploadExcel" ref={uploadInput} />
        <Button
          name="本地解析文件"
          icon={<Iconfont name="iconshangchuan" />}
          onClick={handleFakeUpload}
        >
          上传
        </Button>
      </div>
    </div>
  );
};

export default UploaderParseExcel;
