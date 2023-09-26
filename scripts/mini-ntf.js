require("dotenv").config()
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")

const { API_URL, PRIVATE_KEY, PUBLIC_KEY } = process.env
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
const contractAddress = "0x89399b918350d59f78dbc61da5ee973ced7ec64a"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

// 铸币厂
async function mintNFT(tokenURI) {
    // 获取账户的随机数(用于跟踪从您的地址发送的交易数量)
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest')

    // 配置 nft 的属性
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    }

    // 用私钥签署交易
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    signPromise
        .then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (err, hash) {
                if (!err) {
                    console.log(
                        "The hash of your transaction is: ",
                        hash,
                        "\nCheck Alchemy's Mempool to view the status of your transaction!"
                    )
                } else {
                    console.log(
                        "Something went wrong when submitting your transaction:",
                        err
                    )
                }
            })
        })
        .catch((err) => {
            console.log(" Promise failed:", err)
        })
}

// 将文件开始铸币
mintNFT("ipfs://QmdKAmTj7Pc46Dzmup9ndKCMhqgjEr7iAs59j3zFeH4ezD")