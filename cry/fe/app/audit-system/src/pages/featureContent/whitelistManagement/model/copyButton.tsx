import React, {FC, useCallback, ReactElement} from 'react';
import {Tooltip} from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import {useTransitionState} from '@huse/transition-state';

interface Props {
    text: any;
    children: ReactElement;
}

const CopyButton: FC<Props> = ({text, children}) => {
    const [noticing, setNoticing] = useTransitionState(false, 2500);
    const copy = useCallback(() => setNoticing(true), [setNoticing]);

    return (
        <Tooltip visible={noticing} title="已复制至剪贴板">
        <CopyToClipboard text={text} onCopy={copy}>
                        {children}
        </CopyToClipboard>
        </Tooltip>
    );
};

export default CopyButton