import React from 'react';
import {ChainItemProp} from '@/config/app';
import {Collapse, Button, Icon, Modal} from 'antd';
import {connect} from 'dva';
const Panel = Collapse.Panel;
interface IProp {
    children?: never[]
    chainDetailList: ChainItemProp[]
    switchAddModal?: any
    deleteCurChain?: any
}
interface addItemProp {
    source_id: number
    pid: number
    chain: string
}

class ChainItem extends React.Component<IProp> {
    constructor(props: IProp) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.addNextChain = this.addNextChain.bind(this);
        this.deleteChain = this.deleteChain.bind(this);
        this.updateChain = this.updateChain.bind(this);
        this.state = {
            newChainVisible: false
        }
    }
    handleChange(key: any) {
    }
    extraButton(item: ChainItemProp) {
        return (
            <>
                <Icon type="edit" style={{color: 'rgb(4, 130, 220)', marginRight: '10px'}} onClick={(event: any) => this.updateChain(event, item)} />
                <Icon type="plus" style={{color: 'rgb(4, 130, 220)', marginRight: '10px'}} onClick={(event: any) => this.addNextChain(event, item)} />
                <Icon type="close" style={{color: 'red'}} onClick={(event) => this.deleteChain(event, item)} />
            </>
        )
    }
    updateChain(event: any, data: ChainItemProp) {
        event.stopPropagation();
        event.preventDefault();
        this.props.switchAddModal(data, 'edit');
    }
    addNextChain(event: any, data: ChainItemProp) {
        event.stopPropagation();
        event.preventDefault();
        this.props.switchAddModal(data, 'add');
    }
    deleteChain(event: any, data: ChainItemProp) {
        event.stopPropagation();
        event.preventDefault();
        this.props.deleteCurChain(data);
    }
    render() {
        let list: any = this.props.chainDetailList;
        return (<>
            <Collapse accordion onChange={this.handleChange}>
            {
                list.map((item: ChainItemProp, index: number) => {
                    return <Panel key={`${item.chain_id}-${item.chain}`} header={item.chain} extra={this.extraButton(item)}>
                        {
                            item.childData && item.childData.length > 0
                            ? <ChainItem
                                chainDetailList={item.childData}
                                switchAddModal={this.props.switchAddModal}
                                deleteCurChain={this.props.deleteCurChain}
                                ></ChainItem>
                            : '暂无链路'
                        }
                    </Panel>
                })
            }
        </Collapse>
        </>)
    }
}
export default connect()(ChainItem);