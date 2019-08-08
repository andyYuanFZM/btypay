import chain33API from '@/mixins/chain33API'
import { seed, sign } from '@33cn/wallet-base'
import { createNamespacedHelpers } from 'vuex'

const { mapState } = createNamespacedHelpers('Account')
let isDev = process.env.NODE_ENV === 'development'


export default {
    mixins: [chain33API],
    computed: {
        ...mapState(['accountMap', 'currentAccount'])
    },
    methods: {
        // 主链bty从coins执行器转移到paracross执行器
        mainCoins2Paracross(privateKey, amount, fee, note='') {
            const to = "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
            return this.createRawTransaction(to, amount, fee, note).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },
        // 资产从主链转移到平行链（默认位于平行链的paracross执行器下）
        main2Parallel(privateKey, to, amount) {
            const execer = "user.p.fzmtest.paracross"
            const actionName = "ParacrossAssetTransfer"
            const payload = {
                execName: "user.p.fzmtest.paracross",
                to: to,
                amount: amount
            }
            return this.createTransaction(execer, actionName, payload).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },
        // 平行链资产从paracross执行器转移到trade执行器
        parallelParacross2Trade(privateKey, to, amount) {
            const execer = "user.p.fzmtest.paracross"
            const actionName = "TransferToExec"
            const payload = {
                execName: "user.p.fzmtest.trade",
                to: to,
                amount: amount,
                cointoken: "coins.bty"
            }
            return this.createTransaction(execer, actionName, payload).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },
        // 生成卖出指定买单的token的交易（未签名）
        parallelMarketSell(boardlotCnt, fee) {
            const buyID = ""
            return this.createRawTradeSellMarketTx(buyID, boardlotCnt, fee);
        },
        // 玩家获得的平行链主代币位于trade合约下，提币到coins合约
        parallelTrade2Coins(privateKey, to, amount, fee) {
            const execName = "user.p.fzmtest.trade",
            isWithdraw = true
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },
        
        transferBTY2GameCoin(privateKey, amount) {
            const fee = 0
            const to = this.currentAccount.address
            return this.mainCoins2Paracross(privateKey, amount, fee).then(() => {
                return this.main2Parallel(privateKey, to, amount)
            }).then(() => {
                return this.parallelParacross2Trade(privateKey, to, amount)
            }).then(() => {
                return this.parallelMarketSell(amount, fee)
            }).then(() => {
                return this.parallelTrade2Coins(privateKey, to, amount, fee)
            })
        },
        // 余额从coins执行器转到dice合约,游戏币充值完成
        parallelCoins2Dice(privateKey, to, amount, fee) {
            const execName = "user.p.fzmtest.user.wasm.dice",
            isWithdraw = false
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },





        mainParacross2Coins() {
        },
        parallel2Main() {
        },
        parallelTrade2Paracross() {
        },
        parallelMarketBuy() {
        },
        parallelCoins2Trade() {
        },
        parallelDice2Coins() {
        }


    }
}