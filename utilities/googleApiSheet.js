const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const getClient = async () => {
    return await auth.getClient();
};

const getGoogleSheetsInstance = async () => {
    const client = await getClient();
    return google.sheets({ version: "v4", auth: client });
};

const getSpreadsheetMetadata = async (spreadsheetId) => {
    const googleSheets = await getGoogleSheetsInstance();
    const metadata = await googleSheets.spreadsheets.get({
        spreadsheetId,
    });
    return metadata;
};

const getSpreadsheetRows = async (spreadsheetId, range) => {
    const googleSheets = await getGoogleSheetsInstance();
    const rows = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });
    return rows;
};

const updateSpreadsheetRow = async (spreadsheetId, range, values) => {
    const googleSheets = await getGoogleSheetsInstance();
    const rows = await googleSheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
            values,
        },
    });
    return rows;
};
const appendSpreadsheetRow = async (spreadsheetId, range, values) => {
    const googleSheets = await getGoogleSheetsInstance();
    await googleSheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
            values,
        },
    });
};

module.exports = {
    getClient,
    getGoogleSheetsInstance,
    getSpreadsheetMetadata,
    getSpreadsheetRows,
    appendSpreadsheetRow,
    updateSpreadsheetRow,
    spreadsheetId: process.env.spreadsheetId ,
};
