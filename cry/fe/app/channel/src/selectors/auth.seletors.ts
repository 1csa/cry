import { ConnectState } from '@/models/connect'

export default {
  auth: (state: ConnectState): Array<number> => state.auth.auth
}