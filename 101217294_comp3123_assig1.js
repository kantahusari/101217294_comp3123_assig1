const express = require('express')
const fs = require('fs')
const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();
app.get('',
  (req, res) => {
    res.send('we are in home page')
  }
);
app.get('/user',
  (req, res) => {
    let uid = req.query.uid;
    if(uid==undefined || uid==null || uid==''){
      let msg='No ID is Entered';
      res.send(
        `<!DOCTYPE html><html><head></head><body>` +
        `<form action="http://localhost:8080/user" method="GET">` +
        `Client ID: <input type="text" name="uid"><br>` +
        `<input type="submit" value="find client"></form><br>` +
        `Result: <p>${msg}</p><br>` +
        `</body></html>`
      );
      res.end();
    }else{
      console.log(`Request sent: ${uid}`);
      fs.readFile('users.json',
      (err, data) => {
        if(err){
          let msg='No File was found';
          res.send(
            `<!DOCTYPE html><html><head></head><body>` +
            `<form action="http://localhost:8080/user" method="GET">` +
            `Client ID: <input type="text" name="uid"><br>` +
            `<input type="submit" value="find client"></form><br>` +
            `Result: <p>${msg}</p><br>` +
            `</body></html>`
          );
          res.end();
        }else{
          let file=JSON.parse(data);
          let ids=[];
          for(let value in file){
            ids.push(file[value].id);
          }
          //console.log(ids);
          let verify=ids.includes(parseInt(uid));
          //console.log(verify);
          if(verify){
            let msg='';
            for(let value in file){
              if(file[value].id!=uid){
                continue;
              }else{
                msg += `{<br>
                  "id": ${file[value].id}<br>
                  "name": ${file[value].name}<br>
                  "email": ${file[value].email}<br>
                  "addres": "${file[value].address.street},${file[value].address.city}, ${file[value].address.zipcode}<br>
                  "phone": ${file[value].phone}<br>
                 }<br>`;
              }
            }
            res.send(
              `<!DOCTYPE html><html><head></head><body>` +
              `<form action="http://localhost:8080/user" method="GET">` +
              `Client ID: <input type="text" name="uid"><br>` +
              `<input type="submit" value="find client"></form><br>` +
              `Result: <p>${msg}</p><br>` +
              `</body></html>`
            );
            res.end();
          }else{
            let msg="No user found";
            res.send(
              `<!DOCTYPE html><html><head></head><body>` +
              `<form action="http://localhost:8080/user" method="GET">` +
              `Client ID: <input type="text" name="uid"><br>` +
              `<input type="submit" value="find client"></form><br>` +
              `Result: <p>${msg}</p><br>` +
              `</body></html>`
            );
            res.end();
          }
        }
      }

      );
    }
  }
);
app.get('/users/all',
  (req, res) => {
    fs.readFile(`users.json`,
      (err, data) => {
        if (err) { res.send('Error reading file') }
        else {
          let file = JSON.parse(data);
          let names = [];
          for (let value in file) {
            names.push(file[value].name);
          }
          names.sort();
          let result = [];
          for (let name in names) {
            for (let obj in file) {
              if (file[obj].name != names[name]) {
                continue;
              } else {
                result.push(file[obj]);
              }
            }
          }
          let user = '';
          for (let value in result) {
            user += `{<br>
             "id": ${result[value].id}<br>
             "name": ${result[value].name}<br>
             "username": ${result[value].username}<br>
             "email": ${result[value].email}<br>
             "addres": "${result[value].address.street},${result[value].address.suite},${result[value].address.city}, ${result[value].address.zipcode}, ${result[value].address.geo.lat},${result[value].address.geo.lng}<br>
             "phone": ${result[value].phone}<br>
             "website": ${result[value].website}<br>
             "company": ${result[value].company.name}, ${result[value].company.catchPhrase}, ${result[value].company.bs}<br>
            }<br>`;
          }
          res.send(`Sorted Users: <br>{<br>${user}<br>}`);
          res.end();
        }
      }
    );
  }
);
var server = app.listen(port, () => {
  console.log(`Server is Listening to port: ${port} -------------------------------------------`)
})