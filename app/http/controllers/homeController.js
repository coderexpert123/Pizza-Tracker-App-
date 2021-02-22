const Menu = require('../../models/menu')

function homeController() {

    return {
        async index(req, res) {
            const pizas = await Menu.find()
            console.log(pizas)
            return res.render('home', { pizas: pizas })

        }
    }
}
module.exports = homeController