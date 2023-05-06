/**
 * oppo配额
 */

import React, { useEffect, useState } from 'react';
import { message, Button, Modal, Table } from 'antd';

import { oppo_columns } from '@/config/editorpush/push.config';
import { getOppoQuota } from '@/services/editorpushService';

/**
 * @returns oppo配额
 */
export const PushQuota: React.FC = React.memo(() => {
  const [showOppo, setShowOppo] = useState<boolean>(false);
  const [oppoQuotas, setOppoQuotas] = useState([]);

  const handleFetchQuota = async () => {
    try {
      const fetchRes = await getOppoQuota();
      if (fetchRes.status === 'success') {
        let sumAvaCount = 0,
          sumSendCount = 0,
          sumRemainingCount = 0,
          sumPercent = 0,
          gmt_create = null;
        if (fetchRes.result.length > 0) {
          fetchRes.result.map((item: any) => {
            sumAvaCount += Number(item.level_avalible_count);
            sumSendCount += Number(item.send_count);
            sumRemainingCount += Number(item.remaining_count);
          });
          gmt_create = fetchRes.result[0].gmt_create;
          sumPercent = Number(sumSendCount / sumAvaCount);
          fetchRes.result.push({
            level_avalible_count: sumAvaCount,
            send_count: sumSendCount,
            remaining_count: sumRemainingCount,
            gmt_create,
            send_percent: sumPercent,
            level_name: '总计',
            id: 'sum',
          });
          console.log(fetchRes.result, '-----');
          setOppoQuotas(fetchRes.result);
        } else {
          message.error('接口没数据');
        }
      } else {
        throw new Error(fetchRes.message);
      }
    } catch (err) {
      message.error(err.toString());
    } finally {
      setShowOppo(true);
    }
  };

  return (
    <>
      <Button type="link" size="small" onClick={handleFetchQuota}>
        OPPO配额监控
      </Button>
      <Modal width={800} title="OPPO额度监控" visible={showOppo} onCancel={() => setShowOppo(false)} footer={null} closable={false}>
        <Table columns={oppo_columns} dataSource={oppoQuotas} pagination={false} rowKey={record => record.id} />
      </Modal>
    </>
  );
});
