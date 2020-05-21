const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require('express');
const route = express.Router();
const model = require('./model');

route.get('/api/track/:tracking', async (req, res) => {
    const { tracking } = req.params;
    if (!tracking) return res.status(400).json({ message: 'without tracking number' })
    const exists = await model.findOne({ trackNumber: tracking });

    const result = await axios.get(`https://www.linkcorreios.com.br/?id=${tracking}`, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7,es;q=0.6",
            "cache-control": "max-age=0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        },
        "referrer": "https://www.linkcorreios.com.br/",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors",
        responseType: 'arraybuffer'
    });

    const dom = new JSDOM(new Buffer.from(result.data));
    const html = dom.window.document.querySelectorAll('.card-header > ul > li');

    if (html.length < 1) return res.status(200).json({ message: 'Verifique o código e tente novamente.' })

    let info = {};
    [...html].forEach(item => {

        if (item.textContent.includes('Status')) {
            let _status = item.textContent.slice(8).trim();
            info.status = _status
        }

        if (item.textContent.includes('Data')) {
            let _data = item.textContent.slice(8).trim();
            info.data = _data
        }

        if (item.textContent.includes('Local')) {
            let _local = item.textContent.slice(7).trim();
            info.local = _local
        }
    })

    let ds = {
        trackNumber: tracking,
        info: info,
        searchData: new Date()
    }

    const dbResult = exists._id ? await model.findOneAndUpdate(
        { _id: exists._id },
        { $set: { ...ds } },
        { new: true }
    ) : await model.create({ ...ds })

    res.status(200).json({ dbResult })
})


module.exports = app => app.use(route)
