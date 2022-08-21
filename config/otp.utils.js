const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

exports.generateOTP = (otp_length) => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};


exports.twilio = async (phoneNumber, generated) => {
    await client.messages
        .create({
            body: "message " + generated,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });


}


