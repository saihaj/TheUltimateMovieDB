import express from 'express'

const router = express()
router.get('/', (_req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /users'
    })
    // next()
})

router.get('/:UserID', (req, res, next) => {
    const id = req.params.UserID;
    if (id === 'special') {
        res.status(200).json({
            message: 'You have discovered the special ID',
            id: id
        });
    }
    else {
        res.status(200).json({
            message: 'you passed an ID'
        });
    }
})

module.exports = router
