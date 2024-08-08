const express = require("express");
const {
    getSpreadsheetMetadata,
    getSpreadsheetRows,
    appendSpreadsheetRow,
    updateSpreadsheetRow,
    spreadsheetId,
} = require("./utilities/googleApiSheet");
const bodyParser = require("body-parser")

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json()); // Para analizar JSON




app.get("/", (req, res) => {
    res.render("index");
});


app.get("/youtube",(req,res)=>{
    res.render("youtube")
})
app.get("/course", async(req, res) => {
    try {
        const rows = await getSpreadsheetRows(spreadsheetId, "Hoja 1!A1:G35");
        // const rowsSecondSheet = await getSpreadsheetRows(spreadsheetId, "Hoja 1!A1:G35");

        res.render("course",{courses:rows.data.values });
    } catch (error) {
        res.status(500).data(error.message);
    }
});



app.post("/", async (req, res) => {
    const { url, categorie, source ,description} = req.body;

    const rows = await getSpreadsheetRows(spreadsheetId, "Hoja 1!A1:G35");
    
    try {
        await appendSpreadsheetRow(spreadsheetId, "Hoja 1!A1:G35", [
            [source, url, categorie,description],
        ]);
        res.render("course",{courses:rows.data.values});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/route', async(req, res) => {
    const { id_value, note_value } = req.body;
    
    // Aquí puedes hacer lo que necesites con los datos recibidos
    console.log('ID:', id_value);
    console.log('Note:', note_value);

    try {
        // Define your spreadsheet ID and range
        const range = 'Hoja 1!A:F'; // Update the range according to your sheet

        // Fetch current values
        const response = await getSpreadsheetRows(spreadsheetId, range);
        const rows = response.data.values;
        console.log(response.data.values);

        let rowIndexToUpdate = -1;

        // Find the row to update based on ID
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][5] === `${id_value}`) { // Assuming ID is in the 6th column (index 5)
                rowIndexToUpdate = i + 1; // Google Sheets uses 1-based index
                break;
            }
        }

        if (rowIndexToUpdate === -1) {
            res.status(404).send('ID not found');
            return;
        }

        console.log(rowIndexToUpdate);
        // Update the row with new note value
        const rangeToUpdate = `Hoja 1!E${rowIndexToUpdate}`; // Update the column and row index accordingly
        console.log(rangeToUpdate);

        const responseStatus =  await updateSpreadsheetRow(spreadsheetId, rangeToUpdate, [[note_value]]);

        res.render("index")


    } catch (error) {
        console.error('Error updating notes:', error);
        res.status(500).send('Error updating notes');
    }
});
app.listen(3000, () => {
    console.log("Running on port 3000");
});
