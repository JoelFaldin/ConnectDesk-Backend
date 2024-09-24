const endpointTypo = (req, res) => {
    return res.status(404).send({ error: 'Theres an error in the url.' })
}

module.exports = { endpointTypo }