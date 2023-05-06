import { ConnectState } from '@/models/connect'
import { ChannelEditProps, ChannelAllProps, FavsProps } from '@/config/sider'

export default {
  channelEdit: (state: ConnectState): Array<ChannelEditProps> => state.sider.channelEdit,
  channelAll: (state: ConnectState): Array<ChannelAllProps> => state.sider.channelAll,
  favs: (state: ConnectState): Array<FavsProps> => state.sider.favs
}