var express = require('express');
var path = require('path');
var session = require('express-session');
var app = express();
var mongo = require('mongodb').MongoClient;
const connectionstring = 'mongodb://127.0.0.1:27017'
const databasename = 'myDB'
const PORT = process.env.port || 3000
const destination = [
    'Paris',
    'Bali',
    'Rome',
    'Santorini',
    'Inca',
    'Annapurna'
]
var want
const collectionname = "myCollection"
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: true,
        secure: false
    }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

let is_logged = (req, res, next) => {
    if (req.session && session.username)
        next();
    else
        res.redirect('login')
}
function checkuser(req, res, next) {
    mongo.connect(connectionstring, async (err, client) => {
        if (err) console.log(err);

        const collection = client.db("myDB").collection(collectionname);
        // Find the first object that matches the filter
        collection.findOne({ username: req.body.username, password: req.body.password }, function (err, result) {
          //  res.session.username = req.body.username;
                // await 
                // client.close();
            if (err) {
                // res.render('/login');
                console.log("invalid username");
            }
            if (result) { next(); }

        });

    })

}

function search(req, res, next) {
    const item = req.body.Search.toLowerCase();
    let results = []
    for (let i = 0; i < destination.length; i++) {
        if (destination[i].toLowerCase().includes(item))
            results.push(destination[i])
    }

    res.render('searchresults', { results })
}

app.post('/search', search)


app.post('/register', function (req, res) {
    mongo.connect(connectionstring, async (err, client) => {
        if (err) console.log(err);
        const collection = client.db("myDB").collection(collectionname);
        // Find the first object that matches the filter
        collection.insertOne({ username: req.body.username, password: req.body.password ,list:[]});
        // await
        // client.close();
        res.redirect('/login');
        
    });
});
function wanttogo(req,res,city){
    mongo.connect(connectionstring, async (err, client) => {
        if (err) console.log(err);
        const collection = client.db("myDB").collection(collectionname);
        await collection.updateOne({username:session.username},{ $addToSet : {list : city}})
    });
}
const pr =console.log;
function getfromlistO(req,res){
    mongo.connect(connectionstring, async (err, client) => {
        if (err) console.log(err);
        const collection = client.db("myDB").collection(collectionname);
        
         let results =(await  collection.find({username:session.username}).toArray());
pr(results);
        let li=results[0].list;
        pr(li);
        let final = [];
        
        for (let i=0;i<li.length;i++) {
        final.push(li[i])    
        
        }
pr(final)
        //li.push();
        res.render('wanttogo',{final})
    });
}
app.post('/rome',function(req,res){
   // console.log(session.username+"ghhhhhhhhhhhhhhhhhhhhh");
    wanttogo(req,res,'rome');
    // let mss ='Done'
    res.render('rome');
});
app.post('/paris',function(req,res){
    // console.log(session.username+"ghhhhhhhhhhhhhhhhhhhhh");
     wanttogo(req,res,'paris');
     // let mss ='Done'
     res.render('paris');
 });
 app.post('/inca',function(req,res){
    // console.log(session.username+"ghhhhhhhhhhhhhhhhhhhhh");
     wanttogo(req,res,'inca');
     // let mss ='Done'
     res.render('inca');
 });
 app.post('/bali',function(req,res){
    // console.log(session.username+"ghhhhhhhhhhhhhhhhhhhhh");
     wanttogo(req,res,'bali');
     // let mss ='Done'
     res.render('bali');
 });
 app.post('/annapurna',function(req,res){
    // console.log(session.username+"ghhhhhhhhhhhhhhhhhhhhh");
     wanttogo(req,res,'annapurna');
     // let mss ='Done'
     res.render('annapurna');
 });
 app.post('/santorini',function(req,res){
    // console.log(session.username+"ghhhhhhhhhhhhhhhhhhhhh");
     wanttogo(req,res,'santorini');
     // let mss ='Done'
     res.render('santorini');
 });

app.post('/login',checkuser, function (req, res) {
   // res.session.username = req.body.username;
    session.username =  req.body.username;
    res.redirect('/home');

});
app.get('/login', function (req, res) {
    res.render('login', { message: 'Nice' })
    //res.redirect('/paris')
});
app.get('/', function (req, res) {
    res.redirect('home')
    //res.redirect('/paris')
});

app.get('/paris', is_logged, (req, res) => {
    res.render('paris')
});

app.get('/annapurna', is_logged, (req, res) => {
    res.render('annapurna')
});

app.get('/bali', is_logged, (req, res) => {
    res.render('bali')
});

app.get('/cities', is_logged, (req, res) => {
    res.render('cities')
});

app.get('/hiking', is_logged, (req, res) => {
    res.render('hiking')
});

app.get('/home', is_logged, (req, res) => {
    res.render('home')
});

app.get('/inca', is_logged, (req, res) => {
    res.render('inca')
});

app.get('/islands', is_logged, (req, res) => {
    res.render('islands')
});

app.get('/registration', (req, res) => {
    res.render('registration')
});

app.get('/rome', is_logged, (req, res) => {
    res.render('rome')
});

app.get('/santorini', is_logged, (req, res) => {
    res.render('santorini')
});

app.get('/searchresults', is_logged, (req, res) => {
    // res.sendStatus(404)
});

app.get('/wanttogo', is_logged, (req, res) => {
    getfromlistO(req,res);
    //res.render('wanttogo');
});



app.listen(PORT);
