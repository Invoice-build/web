const explorerMap = {
  mainnet: 'etherscan.io',
  goerli: 'goerli.etherscan.io',
  polygon: 'polygonscan.com'
}

export default class Link {
  address (addr, { network = 'mainnet' } = {}) {
    const domain = explorerMap[network] || ''
    return `https://${domain}/address/${addr}`
  }

  transaction (txHash, { network = 'mainnet' } = {}) {
    const domain = explorerMap[network] || ''
    return `https://${domain}/tx/${txHash}`
  }
}
