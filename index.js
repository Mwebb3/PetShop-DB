const pg = require("pg")
const client = new pg.Client("postgres://localhost/petshop_db");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());

app.get("/api/pets", async(req, res, next) => {
    try{
        const SQL = `
            SELECT *
            FROM pets
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    }
    catch(ex){
        next(ex);
    }
});

const setup = async() => {
    await client.connect();
    const SQL = `
        DROP TABLE IF EXISTS pets;
        CREATE TABLE pets(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            is_favorite BOOLEAN
        );
        INSERT INTO pets (name) VALUES ('Pet 1');
        INSERT INTO pets (name) VALUES ('Pet 2');
        INSERT INTO pets (name) VALUES ('Pet 3');
        INSERT INTO pets (name, is_favorite) VALUES ('Pet 4', true)
    `;
    await client.query(SQL);
    console.log("table done");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
};
setup();