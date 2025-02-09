import { getChromeStorage, setChromeStorage } from "@/libs/chromeUtil"
import Vue from 'vue'

const state = {
  password: '',
  seed: '',//助记词
  accountMap: {},
  currentAccount: {
    // address: "1EscufYUAkgCTTAFVqXmHMvRZMucTepvUM",   //1
    // address: "15KHkN7db2dUF5oWcvwTSSxg2uFqTHJH8J",   //2
    address: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb",   //3
    // address: "1NN5DQHp5goSLLFe6BhfL8DKALoCNuR9PT",   //4
    base58PrivateKey: "",
    // hexPrivateKey: "",   //1
    // hexPrivateKey: "",   //2
    hexPrivateKey: '', //3
    index: 0,
    name: "创世地址"
  },
  mainIsConnected: 1,//1:连接中；2:连接成功；3:连接失败
  parallelIsConnected: 1,//1:连接中；2:连接成功；3:连接失败


  mainAsset: {
    amt: 0.0000,
    price: 10
  },
  parallelAsset: {
    name: "GBT",
    amt: 0.0000,
    price: 1
  },

  // 1xzVbLNynwDNLjPNF8zvXfbygQvFcZG4a
  mainNode: [{ index: 0, url: 'http://114.55.11.139:1193', txHeight: -1, txIndex: 0, name: "BTY" }],
  currentMain: { index: 0, url: 'http://114.55.11.139:1193', txHeight: -1, txIndex: 0, name: "BTY" },

  parallelNode: [
    { index: 0, name: 'gameTest', coin: "GBT", url: "http://114.55.11.139:1200", txHeight: -1, txIndex: 0,paraAddr:'',tradeAddr:'' },
    { index: 1, name: 'game', coin: "GBTY", url: "http://47.98.245.85:8901", txHeight: -1, txIndex: 0 ,paraAddr:'',tradeAddr:''},
  ],
  currentParallel: { index: 0, name: 'gameTest', coin: "GBT", url: "http://114.55.11.139:1200", txHeight: -1, txIndex: 0,paraAddr:'',tradeAddr:'' },
  // currentParallel: { index: 1, name: 'game', coin: "GBTY", url: "http://47.98.245.85:8901", txHeight: -1, txIndex: 0 },

}

const mutations = {
  UPDATE_MAIN_CONNECT(state, payload) {
    state.mainIsConnected = payload;
  },
  UPDATE_PARALLEL_CONNECT(state, payload) {
    state.parallelIsConnected = payload;
  },
  UPDATE_PASSWORD(state, payload) {
    state.password = payload;
  },
  UPDATE_SEED(state, payload) {
    state.seed = payload;
  },
  UPDATE_ACCOUNTS(state, accountMap) {
    state.accountMap = accountMap
  },
  UPDATE_CURRENTACCOUNT(state, currentAccount) {
    state.currentAccount = currentAccount
  },

  UPDATE_MAIN_NODE(state, payload) {
    // state.mainNode.push(payload);
    state.mainNode = payload;
    // let backup = JSON.parse(JSON.stringify(state.mainNode))
    // backup.push(payload)
    // setChromeStorage("mainNodeList", backup).then(res => {
    //   if(res = "success"){
    //     state.mainNode = backup
    //   }
    // })
  },
  UPDATE_CURRENT_MAIN(state, { index, url, txHeight, txIndex, name }) {
    let backup = JSON.parse(JSON.stringify(state.mainNode))
    let length = state.mainNode.length;
    // let i = state.currentMain.index
    let i = 0;
    for(let j = 0; j < length; j++){
      if(state.mainNode[j].index == index){
        i = j
        break
      }
    }
    if (i !== -1) {
      index && (backup[i].index = index)
      url && (backup[i].url = url)
      txHeight && (backup[i].txHeight = txHeight)
      txIndex && (backup[i].txIndex = txIndex)
      name && (backup[i].name = name)
      // setChromeStorage("mainNodeList", backup).then(res => {
      //   if (res == "success") {
          state.mainNode = backup
          state.currentMain = backup[i]
          
      //   }
      // })
    }
    // index && (state.mainNode[i].index = index)
    // url && (state.mainNode[i].url = url)
    // txHeight && (state.mainNode[i].txHeight = txHeight)
    // txIndex && (state.mainNode[i].txIndex = txIndex)
    // coin && (state.mainNode[i].coin = coin)

    // state.currentMain = {...{ index, url, txHeight, txIndex, name }}
  },
  UPDATE_PARALLEL_NODE(state, payload) {
    // state.parallelNode.push(payload);
    state.parallelNode = payload;
    // let backup = JSON.parse(JSON.stringify(state.parallelNode))
    // backup.push(payload)
    // setChromeStorage("parallelNodeList", backup).then(res => {
    //   if (res == "success") {
    //   state.parallelNode = backup
    //   }
    // })
  },
  UPDATE_CURRENT_PARALLEL(state, { index, url, txHeight, txIndex, coin,name,paraAddr,tradeAddr }) {
    let backup = JSON.parse(JSON.stringify(state.parallelNode))
    let length = state.parallelNode.length;
    // let i = state.currentParallel.index
    let i = 0;
    for(let j = 0; j < length; j++){
      if(state.parallelNode[j].index == index){
        i = j
        break
      }
    }
    index && (backup[i].index = index)
    url && (backup[i].url = url)
    txHeight && (backup[i].txHeight = txHeight)
    txIndex && (backup[i].txIndex = txIndex)
    coin && (backup[i].coin = coin)
    name && (backup[i].name = name)
    paraAddr && (backup[i].paraAddr = paraAddr)
    tradeAddr && (backup[i].tradeAddr = tradeAddr)
    // setChromeStorage("parallelNodeList", backup).then(res => {
    // if (res == "success") {
      state.parallelNode = backup
      state.currentParallel = backup[i]
      // console.log("----------------------")
      // console.log(state.parallelNode)
      // console.log(state.currentParallel)
      // console.log("----------------------")
    // }
    // })
    // state.parallelNode = {...{ index, url, txHeight, txIndex, coin,name,paraAddr,tradeAddr }}
  },

  UPDATE_MAIN_ASSET(state, { amt, price }) {
    if (amt || amt == 0) {
      state.mainAsset.amt = amt
    }
    if (price) {
      state.mainAsset.price = price
    }
  },
  UPDATE_PARALLEL_ASSET(state, { name, amt, price }) {
    if (name) {
      state.parallelAsset.name = name
    }
    if (amt || amt == 0) {
      state.parallelAsset.amt = amt
    }
    if (price) {
      state.parallelAsset.price = price
    }
  },


}

export default {
  namespaced: true,
  state,
  mutations
}
