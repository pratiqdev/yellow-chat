import { GlobalState } from "@/lib/types"

export const STORAGE_PREFIX = 'pratiqdev_yellowchat'

export const DEFAULT_USER = 'Anon'

export const DEFAULT_STATE: GlobalState = {
    step: 0,
    username: DEFAULT_USER,
    activeChannel: '',
    channelMap: {},
    showSetupModal: true,
    showChannelMenu: false,
    showChannelModal: false,
    showUsernameModal: false,
}