
import express from 'express'; //imports express framework for API communication
import bodyParser from 'body-parser'; //imports parse for translate JSON format
import twilio from 'twilio'; //imports twilio for WhatsApp Integration
import cors from 'cors'; //imports cors to enable communication between ports
import { env } from 'node:process'; // Import dotenv to load the environment variables
import { createClient } from '@supabase/supabase-js'; //creates a supabase client to interate with the Supabase Database
import cron from 'node-cron'; //imports cron package for automated tasks

const app = express(); //initialzing express js
const port = env.PORT || 5000; //sets the server port (default 5000)

//Middleware
app.use(cors()); //enable cors
app.use(bodyParser.json()); //sets body parser to accept JSON requests

//Sets Twilio credentials
const accountSid = 'AC84b4431a61ec2cc77e991e13eddcd3d9';
const authToken = '084c3b1f86ba0d5706ea8d372613377a';
const client = twilio(accountSid, authToken);

//Use environment variables for Supabase credentials
const supabaseUrl = 'https://ozqeuffkgiiqvntfypmq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cWV1ZmZrZ2lpcXZudGZ5cG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMTYyODQsImV4cCI6MjA1MDc5MjI4NH0.Ciwb8mNvzrcKzekFDWi8YujXt4t5zvIQrhHjkZi1Ssg';

const supabase = createClient(supabaseUrl, supabaseKey);


//Post Endpoint to send WhatsApp messages
app.post('/send-message', (req, res) => { //defines post endpoint at '/send-message'
    const { phoneNumber, message } = req.body; //destructures phone number , message to request body

    client.messages.create({ //creates a WhatsApp message
        from: 'whatsapp:+14155238886', // Twilio Sandbox Number
        to: `whatsapp:${phoneNumber}`, //Client Number
        body: message,
    })
        .then(message => res.json({ success: true, messageId: message.sid })) //If success, respond with message id
        .catch(error => res.status(500).json({ success: false, error: error.message })); // If error, respond with error message
});
//cron.schedule('0 7 * * *', async () => {
cron.schedule('44 13 * * *', async () => { //"Minute-Hour-Day-Month-Weekday" schedules task in aparticular time

    try {
        const currentDateTime = new Date(); //Gets the current Date

        // Calculate reminder deadline (1 day before due date)
        const reminderDateTime = new Date(currentDateTime);
        reminderDateTime.setDate(currentDateTime.getDate() + 1); //gets the next date

        // Query to find tasks due in the next day and gather all required details
        const { data: tasks, error } = await supabase
            .from('client_case_task')
            .select(`
                client_case_task,
                deadline,
                client_case_id,
                client_case (
                    case_id,
                    client_id,
                    cases (case_no),
                    clients (contact_no)
                )
            `)
            .gt('deadline', currentDateTime.toISOString())
            .lte('deadline', reminderDateTime.toISOString());

        if (error) {
            console.error('Error fetching tasks:', error);
            return;
        }

        // Loop through each task and send reminders
        for (const task of tasks) {
            const { client_case_task, deadline, client_case } = task; // Use correct field names
            const { case_id, client_id, cases, clients } = client_case; // Destructure correctly

            const caseNo = cases.case_no; // Extract case number
            const contactNo = clients.contact_no; // Extract contact number

            const messageBody = `
                Reminder: The task "${client_case_task}" related to case "${caseNo}" is due on (${deadline}).
            `;

            // Send WhatsApp message using Twilio
            await client.messages.create({
                from: 'whatsapp:+14155238886', // Twilio Sandbox Number
                to: `whatsapp:${contactNo}`,
                body: messageBody,
            });

            console.log(`Reminder sent for task "${client_case_task}" related to case "${caseNo}".`);
        }
    } catch (error) {
        console.error('Error in automated reminder process:', error);
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
