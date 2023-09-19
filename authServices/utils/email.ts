import { google } from "googleapis";
import env from "dotenv";
import path from "path";
import nodemailer from "nodemailer";
import ejs from "ejs";

env.config();
const GOOGLE_ID = process.env.GOOGLE_ID!;

const GOOGLE_SECRET = process.env.GOOGLE_SECRET!;

const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;

const GOOGLE_URL = process.env.GOOGLE_URL!;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const URL: string = " http://localhost:4327";
export const sendOpeningAccountMail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "eumeh3882@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const data = {
      email: user.email,
      userName: user.userName,
      url:`${URL}/api/${user.id}/verified`
    };

    const localFile = path.join(__dirname, "../views/accountOpening.ejs");
    const readFile = await ejs.renderFile(localFile, data);
    const mailer = {
      from: "Acount Opening <eumeh3882@gmail.com>",
      to:user.email,
      subject: "welcome ",
      html: readFile,
    };

    transport.sendMail(mailer);
  } catch (error: any) {
    console.log(error);
  }
};
