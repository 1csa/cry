import React, { useState, useEffect, ReactNode } from 'react';
import { connect, router } from 'dva';
import { Dispatch, ConnectState, Callback } from '@/models/connect';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Menu, Button, Checkbox, Modal, Input, Divider, message, Tooltip } from 'antd';
import { PlusOutlined, SettingOutlined, RollbackOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import { siderSelectors, authSelectors } from '@/selectors';
import { siderDispatches } from '@/dispatches';
import { DropResult } from 'react-beautiful-dnd/index';
import { ChannelEditProps, ChannelAllProps, FavsProps } from '@/config/sider';

import './index.less';

interface SiderProps {
  channelEdit: Array<ChannelEditProps>;
  channelAll: Array<ChannelAllProps>;
  favs: Array<FavsProps>;
  auth: Array<number>;
  searchChannelEdit: (keyword: string, success?: Callback, fail?: Callback) => void;
  searchChannelAll: (keyword: string, success?: Callback, fail?: Callback) => void;
  updateFavs: (favs: Array<FavsProps>, success: Callback, fail: Callback) => void;
}

const { Link } = router;
const { SubMenu, Item: MenuItem } = Menu;
const { Search } = Input;

const Sider: React.FC<SiderProps> = ({
  channelEdit,
  channelAll,
  favs: initFavs,
  auth,
  searchChannelEdit,
  searchChannelAll,
  updateFavs,
}) => {
  // favs
  const [favs, setFavs] = useState<Array<FavsProps>>(initFavs);
  // edit state
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // delete favs
  const [selectedFavs, setSelectedFavs] = useState<Array<string>>([]);
  // modal visible
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setFavs(initFavs);
  }, [initFavs]);

  // useEffect(() => {
  //   console.log("initFavs",initFavs)
  // })

  useEffect(() => { // 左侧menu权限过滤
    let tempFavs = [...favs];
    if (!auth.includes(135)) {
      tempFavs = tempFavs.filter(item => item.id !== 'homepage')
    }
    if (!auth.includes(136)) {
      tempFavs = tempFavs.filter(item => item.id !== 'promotion')
    }
    if (!auth.includes(137)) {
      tempFavs = tempFavs.filter(item => item.id !== 'hot')
    }
    if (!auth.includes(214)) {
      tempFavs = tempFavs.filter(item => item.id !== '19thBig')
    }
    if (!auth.includes(272)) {
      tempFavs = tempFavs.filter(item => item.id !== 'hotpolitic')
    }
    setFavs(tempFavs);
  }, [auth])

  // add fav
  const handleAddFav = (fav: ChannelEditProps | ChannelAllProps): void => {
    let isExists = false;
    for (let { id } of favs) {
      if (id === (fav as ChannelEditProps)._id || id === (fav as ChannelAllProps).id) {
        isExists = true;
        break;
      }
    }
    if (isExists) {
      message.info(`${fav.name} 频道已存在`);
    } else {
      const tempFavs = [
        ...favs,
        { id: (fav as ChannelEditProps)._id || (fav as ChannelAllProps).id, name: fav.name },
      ];
      updateFavs(
        tempFavs,
        () => {
          setFavs(tempFavs);
          setVisible(false);
          message.success('添加频道成功');
        },
        err => message.error(`添加频道失败 ${err}`),
      );
    }
  };

  // change delete favs
  const handleChangeSelectedFavs = (fromid: string): void => {
    selectedFavs.push(fromid);
    setSelectedFavs(selectedFavs);
  };

  // delete favs
  const deleteFavs = (): void => {
    const tempFavs = favs.filter((fav: FavsProps) => !selectedFavs.includes(fav.id));
    updateFavs(
      tempFavs,
      () => {
        setFavs(tempFavs);
        setSelectedFavs([]);
        message.success('更新频道成功');
      },
      err => message.error(`更新频道失败 ${err}`),
    );
  };

  // reorder
  const reorder = (
    favs: Array<FavsProps>,
    startIndex: number,
    endIndex: number,
  ): Array<FavsProps> => {
    const result = [...favs];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // drag end callback
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.source.index === result.destination.index) {
      return;
    }
    const tempFavs = reorder(favs, result.source.index, result.destination.index);
    setFavs(tempFavs);
    updateFavs(
      tempFavs,
      () => message.success('调整频道顺序成功'),
      err => message.error(`调整频道顺序失败 ${err}`),
    );
  };

  //
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: 'none',
    paddingLeft: '48px',
    lineHeight: '40px',
    height: '40px',
    margin: '4px 0 8px 0',
    background: isDragging ? 'lightgreen' : '#ffffff',
    ...draggableStyle,
  });

  // render menu
  // const renderMenuItems: ReactNode =
  //   favs &&
  //   favs.map((fav: FavsProps, index: number) => (
  //     <MenuItem key={fav.id}>
  //       <Link to={`/${fav.id}`} >{fav.name}</Link>
  //     </MenuItem>
  //   ));
  const renderMenuItems: ReactNode =
  favs &&
  favs.map((fav: FavsProps, index: number) => (
    <MenuItem key={fav.id}>
      <Link to={{pathname:`/${fav.id}`,state:{initpage:`/${fav.id}1`}}} >{fav.name}</Link>
      {/* {fav.id} */}
    </MenuItem>
  ));

  // render drag menu item
  const renderEditMenuItems: ReactNode = (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {favs &&
              favs.map((fav: FavsProps, index: number) => (
                <Draggable key={fav.id} draggableId={fav.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      <Checkbox onChange={() => handleChangeSelectedFavs(fav.id)}>
                        {fav.name}
                      </Checkbox>
                    </div>
                  )}
                </Draggable>
              ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  // search channel
  const handleSearchChannel = (keyword: string): void => {
    if (keyword) {
      searchChannelEdit(keyword);
      searchChannelAll(keyword);
    }
  };

  // render channel edit item
  const renderChannelEditItem: ReactNode =
    channelEdit &&
    channelEdit.map((item: ChannelEditProps) => (
      <Tooltip title={item._id}>
        <Button
          type="ghost"
          size="small"
          key={item._id}
          style={{ margin: '0 10px 10px 0' }}
          onClick={() => handleAddFav(item)}
        >
          {item.name}
        </Button>
      </Tooltip>
    ));

  // render channel all item
  const renderChannelAllItem: ReactNode =
    channelAll &&
    channelAll.map((item: ChannelAllProps) => (
      <Tooltip title={item.id}>
        <Button
          type="ghost"
          size="small"
          style={{ margin: '0 10px 10px 0' }}
          onClick={() => handleAddFav(item)}
        >
          <span>{item.name}</span>
          <span style={{ margin: '0 5px' }}> | </span>
          <span>{item.userCount}</span>
          <span style={{ margin: '0 5px' }}> | </span>
          <span style={{ color: '#fb8383' }}>{item.type}</span>
        </Button>
      </Tooltip>
    ));

  return (
    <div className="main-sider">
      <div className="sider-op">
        <Button size="small" shape="circle" onClick={() => setVisible(true)}>
          <PlusOutlined />
        </Button>
        {isEdit ? (
          <span>
            <Button size="small" shape="circle" onClick={() => setIsEdit(false)}>
              <RollbackOutlined />
            </Button>
            <Button size="small" shape="circle" onClick={deleteFavs}>
              <DeleteOutlined />
            </Button>
          </span>
        ) : (
          <Button size="small" shape="circle" onClick={() => setIsEdit(true)}>
            <SettingOutlined />
          </Button>
        )}
      </div>
      <Menu
        mode="inline"
        openKeys={['fav']}
        // selectedKeys={ [] }
      >
        <SubMenu
          key="fav"
          title={
            <span>
              <StarOutlined />
              收藏
            </span>
          }
        >
          {isEdit ? renderEditMenuItems : renderMenuItems}
        </SubMenu>
      </Menu>
      <Modal
        title="添加频道"
        visible={visible}
        okText="确定"
        cancelText="取消"
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={900}
      >
        <Search
          className="search"
          placeholder="请输入频道名"
          onSearch={handleSearchChannel}
          style={{ width: '200px', margin: 'auto', display: 'block' }}
        />
        <Divider orientation="left">特殊频道</Divider>
        {renderChannelEditItem}
        <Divider orientation="left">普通频道</Divider>
        {renderChannelAllItem}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: ConnectState) => ({
  channelEdit: siderSelectors.channelEdit(state),
  channelAll: siderSelectors.channelAll(state),
  favs: siderSelectors.favs(state),
  auth: authSelectors.auth(state),
});

const mapDispatchesToProps = (dispatch: Dispatch) => ({
  searchChannelEdit: siderDispatches.searchChannelEdit(dispatch),
  searchChannelAll: siderDispatches.searchChannelAll(dispatch),
  updateFavs: siderDispatches.updateFavsByUserid(dispatch),
});

export default connect(mapStateToProps, mapDispatchesToProps)(Sider);
