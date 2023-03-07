import axios from 'axios'
import BN from 'bignumber.js'
import Base from './base'

export default class Network extends Base {
  constructor (args) {
    super(args)
    this.supportedNetworks = [1, 5, 137]
    this.networkMap = {
      1: 'mainnet',
      5: 'goerli',
      137: 'polygon'
    }
    this.gasPriceUrlMap = {
      1: 'https://www.etherchain.org/api/gasPriceOracle',
      5: 'https://www.etherchain.org/api/gasPriceOracle',
      137: 'https://gasstation-mainnet.matic.network/v2'
    }
  }

  hasProvider () {
    return !!this.provider
  }

  async getBlockNumber () {
    return await this.web3.eth.getBlockNumber()
  }

  async getId () {
    const id = await this.web3.eth.net.getId()
    if (!this.supportedNetworks.includes(id)) throw new Error('Unsupported network')
    return id
  }

  async currentName () {
    const id = await this.getId()
    return this.networkMap[id]
  }

  async gasPrice () {
    const id = await this.getId()
    const { data: gasData } = await axios.get(this.gasPriceUrlMap[id])
    const bn = new BN(gasData.fast)
    return bn.shiftedBy(9).toString(10)
  }
}
