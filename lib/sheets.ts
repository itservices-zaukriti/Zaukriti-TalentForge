import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function pushToGoogleSheets(data: any) {
    try {
        const auth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, auth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        await sheet.addRow({
            Timestamp: new Date().toISOString(),
            Name: data.full_name,
            Email: data.email,
            Phone: data.phone,
            Track: data.track,
            Amount: data.amount_paid,
            Status: data.payment_status,
            Reference: data.payment_reference
        });
    } catch (error) {
        console.error('Google Sheets Error:', error);
    }
}
