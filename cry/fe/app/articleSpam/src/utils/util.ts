import React, { useCallback } from 'react';

export const handleAuditDate = (param: any, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  return param?.format(format);
};
