const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.API_KEY);

const welcomeMail = (email, name) => {

    sgMail.send({
        to: email,
        from: "divy.m@simformsolutions.com",
        subject: "thanks for join",
        text: `welcome to the task-App ${name}`
    });
    
}

const cancelMail = (email, name) => {

    sgMail.send({

        to: email,
        from: "divy.m@simformsolutions.com",
        subject: "why to delete?",
        text: `its sad that you are going ${name}....`

    })
}
module.exports = {
    welcomeMail,
    cancelMail

}