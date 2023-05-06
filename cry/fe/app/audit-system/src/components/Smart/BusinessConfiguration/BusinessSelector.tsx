import React from 'react';

import BasicSelector, { IBasicSelector } from '@/components/Smart/BasicSelector';

interface IBusinessSelector extends IBasicSelector {}

const BusinessSelector: React.FC<IBusinessSelector> = ({ selectProps, servicesFunction, cascaderOptions }) => {
  return <BasicSelector selectProps={selectProps} servicesFunction={servicesFunction} cascaderOptions={cascaderOptions} />;
};

export default BusinessSelector;
