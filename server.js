var express = require('express');
var cors = require('cors')
var mariadb = require('mariadb');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
var app = express();
var port = 3000;

const options = {
    definition: {
        info: {
            title : 'Swagger API demo',
            version: '1.0.0',
            description: 'Assignment 08'
        }
      //  host : '134.209.116.223:3000',
      //  basePath: '/',
    },
    apis: ['server.js']
}

var pool =
  mariadb.createPool({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'sample',
    port : 3306,
    connectionLimit : 5
  });

const swaggerSpec = swaggerJSDoc(options);

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


//Routes

/**
 * @swagger
 * /agents:
 *  get:
 *      description: get agent info
 *      responses:
 *          '200':
 *              description: sucess
 */

app.get('/agents',cors(),async(req,res)=>{

var conn;
try{
conn = await pool.getConnection();
rows = await conn.query("select * from agents");
console.log(rows);
res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});

/**
 * @swagger
 * /customers:
 *  get:
 *      description: get customer info
 *      responses:
 *          '200':
 *              description: sucess
 */

app.get('/customers',cors(),async(req,res) =>{

var conn;
try{
conn = await pool.getConnection();
rows = await conn.query("select * from customer");
console.log(rows);
res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});

/**
 * @swagger
 * /companies:
 *  get:
 *      description: get companies info
 *      responses:
 *          '200':
 *              description: sucess
 */

app.get('/companies',async(req,res) =>{

var conn;
try{
conn = await pool.getConnection();
var rows = await conn.query("select * from company");
console.log(rows);
res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});


/**
 * @swagger
 * /food:
 *  get:
 *      description: get food info
 *      responses:
 *          '200':
 *              description: sucess
 */

app.get('/food',async(req,res) =>{
console.log("inside method get/foods")
var conn;
try{
conn = await pool.getConnection();
var rows = await conn.query("select * from foods");

res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});

// post request

/*

INSERT INTO `foods` (`ITEM_ID`, `ITEM_NAME`, `ITEM_UNIT`, `COMPANY_ID`) VALUES
('1', 'Chex Mix', 'Pcs', '16\r'),
('6', 'Cheez-It', 'Pcs', '15\r'),
('2', 'BN Biscuit', 'Pcs', '15\r'),
('3', 'Mighty Munch', 'Pcs', '17\r'),


CREATE TABLE IF NOT EXISTS `foods` (
 `ITEM_ID` varchar(6) NOT NULL DEFAULT '',
 `ITEM_NAME` varchar(25) DEFAULT NULL,
 `ITEM_UNIT` varchar(5) DEFAULT NULL,
 `COMPANY_ID` varchar(6) DEFAULT NULL,
 PRIMARY KEY (`ITEM_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `foods`
--

*/


/**
 * @swagger
 * /food:
 *  post:
 *      tags:
 *         - Add a food item
 *      description: Create a new food item
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  unit:
 *                    type: string
 *                  company_id:
 *                    type: string
 *              required:
 *                  - id
 *                  - name
 *      responses:
 *          '200':
 *              description: Food created
 *          '400':
 *              description: Bad request
 */



app.post('/food',async(req,res)=>{
var conn;
const id = req.body.id;
const name = req.body.name;
const unit = req.body.unit;
const c_id = req.body.company_id;
console.log(req.body);
try{
  //INSERT INTO `foods` (`ITEM_ID`, `ITEM_NAME`, `ITEM_UNIT`, `COMPANY_ID`) VALUES
        conn = await pool.getConnection();
        rows = await conn.query("insert into foods (ITEM_ID,ITEM_NAME,ITEM_UNIT,COMPANY_ID) values (?,?,?,?)" ,[id,name,unit,c_id]);
        console.log(rows);
        res.send(rows);

throw e;
}finally{
if(conn){
return conn.end();
}
}
});



/**
 * @swagger
 * /food:
 *  put:
 *      tags:
 *         - Update a food item
 *      description: Update a food item
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  unit:
 *                    type: string
 *                  company_id:
 *                    type: string
 *              required:
 *                  - id
 *                  - name
 *                  - unit
 *      responses:
 *          '200':
 *              description: A successful response
 *          '400':
 *              description: Bad request
 */



app.put('/food',async(req,res)=>{
var conn;
const id = req.body.id;
const name = req.body.name;
const unit = req.body.unit;
const c_id = req.body.company_id;
console.log(req.body);
try{
  //INSERT INTO `foods` (`ITEM_ID`, `ITEM_NAME`, `ITEM_UNIT`, `COMPANY_ID`) VALUES
        conn = await pool.getConnection();
        rows = await conn.query("update foods set ITEM_NAME= ?, ITEM_UNIT=? where ITEM_ID =?",[name,unit,id]);
        console.log(rows);
        res.send(rows);

throw e;
}finally{
if(conn){
return conn.end();
}
}
});



/**
 * @swagger
 * /food/{id}:
 *  delete:
 *      tags:
 *         - Delete a food item
 *      description: Delete food by id
 *      parameters:
 *          - name: id
 *            description: provide an id to delete the food item
 *            in: path
 *            type: integer
 *            required: true
 *      responses:
 *          '200':
 *              description: Food item deleted
 *          '400':
 *              description: Bad request
 */

app.delete('/food/:id',async(req,res)=>{
try{
        var id = req.params.id;
        conn = await pool.getConnection();
        rows = await conn.query("delete from foods where ITEM_ID = ?",[id]);
        console.log(rows);
        res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});

/**
 * @swagger
 * /food/{id}:
 *  patch:
 *      tags:
 *         - Patch a food item
 *      description: Food unit can be updated by providing food id
 *      parameters:
 *          - name: id
 *            description: id
 *            in: path
 *            type: integer
 *            required: true
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  unit:
 *                      type: string
 *              required:
 *                  -unit
 *      responses:
 *          '200':
 *              description: Food item updated
 *          '400':
 *              description: Bad request
 */

app.patch('/food/:id',async(req,res)=>{
var conn;
try{
console.log(req.body.unit);
console.log(req.params.id);
const id = req.params.id;
        const unit = req.body.unit;
        conn = await pool.getConnection();
        rows = await conn.query("update foods set ITEM_UNIT = ? where ITEM_ID = ?",[unit,id]);
        console.log(rows);
        res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});


app.listen(port,()=>{
console.log("listening on port 3000");
});
