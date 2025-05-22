import nodemailer from "nodemailer"

const sendEmail = async(subject,text,replyTo) =>{
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: replyTo,
            replyTo,
            subject,
            text
        }
        await transporter.sendMail(mailOptions)
    } catch (error) {
    res.status(500).json({ error: error.message });
        
    }
}

export default sendEmail