import React, { useState } from 'react';
import { Divider, Row, Col, Checkbox } from 'antd';

interface DocItemProps {
  doc: DOC
  index: number
  onChange?: (checked: boolean)=> void
};

const DocItem: React.FC<DocItemProps> = ({doc, index, onChange}) => {
  const onCheckChange = (e: any) => {
    onChange && onChange(e.target.checked);
  }
  return (
    <>
      <Row gutter={2}>
        <Checkbox checked={doc.checked} onChange={onCheckChange}/>&nbsp;&nbsp;
        <a>{`${index + 1} ${doc.title}`}</a>
      </Row>
      <Row gutter={10}>
        <Col span={4}>{doc.docid}</Col>
        <Col span={20}>{doc.date}</Col>
      </Row>
      <Divider dashed={true}/>
    </>
  );
}

export default DocItem;
