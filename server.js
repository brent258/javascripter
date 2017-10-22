const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mail = require('@sendgrid/mail');

const PORT = process.env.PORT || 8080;
const SENDGRID_KEY = process.env.SENDGRID_KEY;
const SENDGRID_EMAIL = process.env.SENDGRID_EMAIL;

app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.route('/')
  .get((req,res,next) => {
    let repos = require('./models/index/repos.json');
    res.render('index', {repos: repos});
  })
  .post((req,res,next) => {
    mail.setApiKey(SENDGRID_KEY);
    const msg = {
      to: SENDGRID_EMAIL,
      from: req.body.inputEmail,
      subject: 'Website enquiry from ' + req.body.inputName,
      text: req.body.inputMessage,
      html: req.body.inputMessage
    };
    mail.send(msg)
    .then(() => {
      res.status(200).json(req.body);
    })
    .catch(err => {
      res.sendStatus(400);
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
