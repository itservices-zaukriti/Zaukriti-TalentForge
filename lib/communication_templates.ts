
// Communication Templates for Zaukriti TalentForge
// These templates are designed for transactional messaging via Email, WhatsApp, and SMS.
// Tone: Professional, clear, parent-safe, non-spammy.

export const NOTIFICATION_TEMPLATES = {
        REGISTRATION_COMPLETE: {
                id: "reg_complete",
                subject: "TalentForge Application Confirmed",
                emailBody: (name: string, track: string, referralCode: string) => `
Hi ${name},

Thank you for applying to the Zaukriti TalentForge (${track}) evaluation track.

Your application is effectively registered in our system.

Next Steps:
1. March: Problem Statement Release (Check your dashboard)
2. April: Proof-of-Work Submission
3. May: Evaluation & Results

You can access your applicant dashboard here:
https://talentforge.zaukriti.com/talentforge/dashboard

Your Referral Code: ${referralCode}
(Optional: Share this with peers who meet the eligibility criteria.)

Note: This is a merit-based evaluation. Completion of tasks is mandatory for certification.

Regards,
The Zaukriti Team
        `,
                whatsappBody: (name: string, referralCode: string) => `
Hi ${name}, 
Your TalentForge application is confirmed. ✅

Next step: Problem selection in March.
Dashboard: https://talentforge.zaukriti.com/talentforge/dashboard

Ref Code: ${referralCode}
        `,
                smsBody: (referralCode: string) => `Zaukriti: App confirmed. Code:${referralCode}. Dashboard: zaukriti.com/login`
        },

        PROBLEM_SELECTION_OPEN: {
                id: "ps_open",
                subject: "Action Required: Select Your Problem Statement",
                emailBody: (name: string) => `
Hi ${name},

The Problem Selection window is now OPEN. 
You must choose your specific challenge before March 31st to proceed to the evaluation phase.

This choice determines your Proof-of-Work assignment.

Login to Dashboard: https://talentforge.zaukriti.com/talentforge/dashboard

Regards,
The Zaukriti Team
        `,
                whatsappBody: (name: string) => `
Hi ${name}, 
Problem Selection is LIVE. 
Login to choose your challenge: https://talentforge.zaukriti.com
        `
        },

        ASSIGNMENT_OPEN: {
                id: "assign_open",
                subject: "Assignment Submission Window Open",
                emailBody: (name: string) => `
Hi ${name},

The Assignment Phase has begun (April 1st).
You can now submit your Proof-of-Work (Write-up + Outputs).

Deadline: April 30, 11:59 PM.
Late submissions will not be accepted.

Submit here: https://talentforge.zaukriti.com/talentforge/dashboard

Regards,
The Zaukriti Team
        `,
                whatsappBody: `
Hi, TalentForge assignment window is OPEN. 
Submit your work before April 30. 
Link: talentforge.zaukriti.com
        `
        },

        RESULTS_DECLARED: {
                id: "results",
                subject: "TalentForge Evaluation Results",
                emailBody: (name: string) => `
Hi ${name},

The evaluation cycle is complete.
Please login to your dashboard to view your final status and download certificates.

View Results: https://talentforge.zaukriti.com/talentforge/dashboard

Thank you for participating.

Regards,
The Zaukriti Team
        `,
                whatsappBody: `
Hi, TalentForge Results are declared. 
Check your status: talentforge.zaukriti.com/dashboard
        `
        },

        PAYMENT_PENDING: {
                id: "payment_pending",
                subject: "Action Required: Complete Your TalentForge Application",
                emailBody: (name: string, resumeLink: string) => `
Hi ${name},

We noticed that your application for the TalentForge evaluation is incomplete pending the registration fee.

To finalize your entry and access the problem statements, please complete the payment step.

Resume Application: ${resumeLink}

If you have already paid, please ignore this message.

Regards,
The Zaukriti Team
        `,
                whatsappBody: (name: string, resumeLink: string) => `
Hi ${name}, 
Your TalentForge application is pending payment. 
Click here to complete it: ${resumeLink}
        `,
                smsBody: (resumeLink: string) => `Zaukriti: Payment pending. Resume here: ${resumeLink}`
        }
};
