import express from 'express'
import axios from 'axios'
import jsdom from 'jsdom'
import cors from 'cors'
import { CoinModel } from './models/CoinModel.js'

const app = express()
const cors = cors()



const { JSDOM } = jsdom

const url = 'https://coinmarketcap.com/'

const port = process.env.PORT || 3000

async function getInfoCoinMarkerCap() {

    const req = await axios.get(url)

    const listObjs = []

    if (req.status == 200) {

        const dom = new JSDOM(req.data)

        dom.window.document.querySelectorAll('tbody tr').forEach((el, i) => {
            
            if (i <= 9) {
                const coinImage = el.querySelector('.coin-logo').src
                const coinParamList = []
                
                
                console.log(`--------COIN ${i + 1}----------`)
                el.querySelectorAll('td').forEach((el, i) => {

                    
                    let content = el.textContent
                    
                    if (content != '' && i < 4) {
                        if (i == 2) {
                            const contentLength = content.length
                            let name, sign

                            for (var i = 0; i < contentLength - 1; i++) {
                                if (parseInt(content.charAt(i))) {
                                    name = content.slice(0, i)
                                    sign = content.slice(i + 1)
                                    coinParamList.push(name)
                                    coinParamList.push(sign)
                                }
                            }
                        } else {
                            coinParamList.push(content)
                        }
                        
                        
                    }
                })
                coinParamList.push(coinImage)
                console.log(coinParamList)
                const coinObj = new CoinModel(coinParamList[0], coinParamList[1], coinParamList[2], coinParamList[3], coinParamList[4])
                listObjs.push(coinObj)
            }

            

            
        })

        return listObjs
    }


    
}

app.use(cors)

app.get('/', async (req, res) =>  {
    res.json('Welcome to the mini crypto API')
})

app.get('/coins', async (req, res) =>  {
    getInfoCoinMarkerCap().then((value) => {
        res.json(value)
    })
})

app.get('/coins/:id', (req, res) => {
    const id = req.params.id
    getInfoCoinMarkerCap().then((value) => {
        res.json(value[id])
    })

})

app.listen(port, () => {
    console.log('RUNNING')
})