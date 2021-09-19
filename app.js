const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require('@mailchimp/mailchimp_marketing');
const https = require("https");
const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: "your-api-key",
  server: "xx"
})

app.post('/', async (req, res) => {
  const firstName = req.body.fname;
  const phoneNumber = req.body.pnumber;
  const emailAddress = req.body.emailid

  const data = {
    members: [{
      email_address: emailAddress,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        PHONE: phoneNumber
      }
    }]
  }

  const response = await mailchimp.lists.batchListMembers('416bb51a5e', data);

  if (response.error_count === 0) {
    res.sendFile(__dirname + "/success.html");
  } else {
    res.sendFile(__dirname + "/failure.html")
  }


});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
