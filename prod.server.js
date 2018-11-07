var express = require('express');
var config = require('./config/index');
var port = process.env.PORT || config.build.port;
var app = express();
var router = express.Router();
router.get('/',function(req,res,next){
  req.url = '/index.html';
  next();
})

app.use(router);

const appData = require('./mock/data.json')
const seller = appData.seller
const ratings = appData.ratings
const goods = appData.goods
app.use('/api', router)

app.get('/api/seller', (req, res, next) => {
  res.json({
    errno:0,
    data:seller
  })
})
app.get('/api/goods', (req, res, next) => {
  res.json({
    errno:0,
    data:goods
  })
})
app.get('/api/ratings', (req, res, next) => {
  res.json({
    errno:0,
    data:ratings
  })
})


app.use(express.static('./dist'));

module.exports = app.listen(port,function(err){
  if(err){
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:'+port+'\n')
})

