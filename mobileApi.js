let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
    res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
const {Client}=require("pg")
const client = new Client({
    user: "postgres",
    password: "employeesTable@123",
    database: "postgres",
    port:5432,
    host: "db.olxkxxxqkfiyhbwrqwqr.supabase.co",
    ssl:{rejectUnauthorized:false},
});
client.connect(function(res,error){
    console.log("Connected!!!");
})
let port = process.env.PORT || 2410
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
// let mysql=require("mysql");
// let {mobiles}=require("./mobileData");
// let conData={
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"test"
// }
// let connection=mysql.createConnection(conData);
// let sql="INSERT INTO mobiles2 (name,price,brand,RAM,ROM,OS) VALUES ?";
// let arr=mobiles.map((mob)=>[mob.name,mob.price,mob.brand,mob.RAM,mob.ROM,mob.OS])
// connection.query(sql,[arr],function(err,result){
//     if(err) console.log(err);
//     else console.log(result);
// });

// app.get("/mobiles/:name",function(req,res){
//   let name=req.params.name;
//   let values=Object.values(req.body);
//   let sql="SELECT * FROM mobiles2 where name=?";
//   client.query(sql,name,function(err,result){
//       if(err) console.log(err);
//       else res.send(result)
//   })
// });
app.get("/mobiles",function(req,res){
  let brand=req.query.brand
  let RAM=req.query.RAM;
  let ROM=req.query.ROM
  let sortBy=req.query.sortBy
    let options="";
    let optionArr=[];
    let values=[brand]
    console.log(optionArr);
    console.log(values);
    // if(brand){
    //   let brandArr=brand.split(",");
    //   options= options ?  ` ${options} AND brand IN ($1)`  :   "WHERE brand IN ($1)";
    //   optionArr.push(brandArr);
    // }
    // if(RAM){
    //   let RAMArr=RAM.split(",");
    //   options=options ?  `${options} AND ram IN ($2)`  :` WHERE ram IN ($2)`;
    //   optionArr.push(RAMArr);
    // }
    // if(ROM){
    //   let ROMArr=ROM.split(",");
    //   options=options ?  `${options} AND rom IN ($3)`  :` WHERE rom IN ($3)`;
    //   optionArr.push(ROMArr);
    // }

    let query=` SELECT * FROM mob ${options}`;
    console.log(query);
    client.query(query,function(err,result){
        if(err) console.log(err);
        else {
          let arr=result.rows
          if(brand){
            let brandArr=brand.split(",");
           arr=arr.filter((br)=>brandArr.find(b=>b===br.brand)); 
          }
          if(RAM){
            let RAMArr=RAM.split(",");
           arr=arr.filter((br)=>RAMArr.find(b=>b===br.ram)); 
          }
          if(ROM){
            let ROMArr=ROM.split(",");
           arr=arr.filter((br)=>ROMArr.find(b=>b===br.rom)); 
          }
          if(sortBy==="name"){
            arr=arr.sort((c1,c2)=>c1.name.localeCompare(c2.name))
          }
          if(sortBy==="price"){
            arr=arr.sort((c1,c2)=>c1.price-c2.price)
          }
          if(sortBy==="brand"){
            arr=arr.sort((c1,c2)=>c1.brand.localeCompare(c2.brand))
          }
          if(sortBy==="ram"){
            arr=arr.sort((c1,c2)=>c1.ram.localeCompare(c2.ram))
          }
          if(sortBy==="rom"){
            arr=arr.sort((c1,c2)=>c2.rom.localeCompare(c1.rom))
          }
          if(sortBy==="os"){
            arr=arr.sort((c1,c2)=>c1.os.localeCompare(c2.os))
          }
          res.send(arr)
        }
       
    })
});

app.get("/mobiles/brand/:brand",function(req,res){
  let brand=req.params.brand;
  let values=[brand]
  console.log(values);
  let sql=` SELECT * FROM mob where brand=$1`;
  client.query(sql,values,function(err,result){
      if(err) console.log(err);
      else res.send(result.rows);
  });  
});
app.get("/mobiles/:name",function(req,res){
  let name=req.params.name;
  let values=[name];
  let sql=` SELECT * FROM mob where name=$1`;
  client.query(sql,values,function(err,result){
      if(err) console.log(err);
      else res.send(result.rows)
  })
});
app.get("/mobiles/RAM/:RAM",function(req,res){
  let RAM=req.params.RAM;
  let values=[RAM];
  let sql=`SELECT * FROM mob where RAM=$1`;
  client.query(sql,values,function(err,result){
      if(err) console.log(err);
      
      else res.send(result.rows)
      console.log(result);
  })
});

app.get("/mobiles/ROM/:ROM",function(req,res){
   let ROM=req.params.ROM;
  let values=[ROM]
  console.log("comsolong values",values);
  let sql=`SELECT * FROM mob where rom=$1`;
  client.query(sql,values,function(err,result){
      if(err) console.log(err);
      else res.send(result.rows)
  })
});

app.get("/mobiles/OS/:OS",function(req,res){
  let OS=req.params.OS;
  let values=[OS]
  let sql=` SELECT * FROM mob where OS=$1`;
  client.query(sql,values,function(err,result){
      if(err) console.log(err);
      else res.send(result.rows)
  })
});

app.post("/newMobile",function(req,res,next){
    // let body=req.body
    let values=Object.values(req.body);
    console.log(values);
    let query=` INSERT INTO mob (id,name,price,brand,ram,rom,os) 
    VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    // let params=[body.name,body.price,body.brand,body.RAM,body.ROM,body.OS];
    client.query(query,values,function(err,result){
        if(err) {
          res.status(404).send(err)
          console.log(err);
        }
        else{
            res.send(`${result.rowCount}`)
        }
    })
});

app.put("/mobiles/:name/edit",function(req,res){
  let name=req.params.name;
  let body=req.body;
  
  let params=[body.name,body.price,body.brand,body.ram,body.rom,body.os,name];
  let sql=` UPDATE mob SET name=$1,price=$2,brand=$3,ram=$4,rom=$5,os=$6 WHERE name=$7`;
  
 client.query(sql,params,function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("No Mobile Found")
    }
    else{
      console.log(result);
      res.send(`${result.rowCount}`)
    }
  })

});

app.delete("/mobiles/:name/delete",function(req,res){
  let name=req.params.name
  let values=[name];
  let sql= ` Delete From mob where name=$1`;
  client.query(sql,values,function(err,result){
    if(err) {
      console.log(err);
      res.status(404).send("No Mobile Found");
    }
    else{
      res.send(result)
    }
  })
 })
 
