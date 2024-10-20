import { Api400Error } from '../handlers/errorHandlers/customError.js';
import errorMessage from '../data/messages.json' assert { type: 'json' };
import { Parser as Json2CsvParser } from "json2csv";

const generateCSV = (res, data, next) => {
    try {
        const fields = ["user", "name", "email", "balance"];
        const json2csvParser = new Json2CsvParser({ fields });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("balance_sheet.csv");
        res.send(csv);
    } catch (error) {
        next(new Api400Error({ message: errorMessage.defaultErr.badRequest }));
    }
};


export { generateCSV };