import React, { useState } from 'react';
import UploaderParseExcel from '@/components/Smart/UploaderParseExcel';
import CustomizeTable from '@/components/Smart/BasicTable/CustomizeTable';
import uploadTableColumn from '../../model/uploadTableColumn';
import { Modal, Button } from 'antd';

interface IUploadFileProps {
  handleUploadData: (data: any[]) => void;
  handleFileRefs: (refs: any) => void;
}

const MAX_VIEW_COUNT: number = 10;

const UploadFile: React.FC<IUploadFileProps> = ({ handleUploadData, handleFileRefs }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [checkButton, setCheckButton] = useState<boolean>(false);
  const [tableList, setTableList] = useState<any[]>([]);

  const handleParsedExcelData = (data: any[]) => {
    setIsModalVisible(true);
    setCheckButton(true);
    setTableList(data);
    handleUploadData(data);
  };

  const handleFileInputRefs = (childRefs: any) => {
    handleFileRefs && handleFileRefs(childRefs);
  };

  const closeModal = () => setIsModalVisible(false);

  return (
    <>
      <div className="upload-panel">
        <div className="title">
          <span className="title-label">
            <span className="danger-text"></span> <span> 文件上传：</span>
          </span>
          <div className="mt10">
            <UploaderParseExcel
              handleFileInputRefs={handleFileInputRefs}
              handleExcelParsedData={handleParsedExcelData}
              tableColumnKey={uploadTableColumn}
            />
          </div>
          {checkButton ? <Button onClick={() => setIsModalVisible(!isModalVisible)}>点击查看预览</Button> : null}
        </div>
      </div>
      <Modal width={'auto'} title="上传数据预览" visible={isModalVisible} onOk={closeModal} onCancel={closeModal}>
        <div className="parse-data-table">
          <h4 className="title"></h4>
          <CustomizeTable rowKey="word" columns={uploadTableColumn.slice(0, -2)} data={tableList?.slice(0, MAX_VIEW_COUNT)!} pagination={{}} />
          <div className="total-count mt10">
            文件共有{tableList?.length}条，当前最多预览{MAX_VIEW_COUNT}条
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UploadFile;
