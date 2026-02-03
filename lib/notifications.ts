import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(email: string, name: string, track: string, referralCode: string) {
    try {
        const shareUrl = encodeURIComponent(`https://zaukriti.ai/apply?ref=${referralCode}`);
        const shareText = encodeURIComponent(`Just joined Zaukriti TalentForge to build in ${track}! Use my code ${referralCode} to join and we both get rewarded. 🚀 #Zaukriti #TalentForge`);

        const response = await resend.emails.send({
            from: 'Zaukriti TalentForge <talentforge@zaukriti.ai>',
            to: email,
            subject: 'Enrollment Confirmed | Zaukriti TalentForge',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ffcc33;">Welcome to the Ecosystem, ${name}!</h2>
                    <p>Your enrollment in <strong>${track}</strong> is confirmed. You are now part of a merit-first community of builders.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #eee; margin: 20px 0; text-align: center;">
                        <h3 style="margin: 0; color: #333;">Your Unique Referral Code</h3>
                        <div style="font-size: 24px; font-weight: bold; color: #ffcc33; margin: 10px 0; letter-spacing: 2px;">${referralCode}</div>
                        <p style="font-size: 14px; color: #666;">Get ₹50 directly for every builder you refer! They get a curated ecosystem, you get rewards. Win-win.</p>
                        
                        <div style="margin-top: 20px;">
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" style="text-decoration: none; margin-right: 10px;"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="30" alt="LinkedIn"/></a>
                            <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}" style="text-decoration: none; margin-right: 10px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="28" alt="Twitter"/></a>
                            <a href="https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}" style="text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" width="30" alt="WhatsApp"/></a>
                        </div>
                    </div>

                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>Onboarding instructions will follow shortly.</li>
                        <li>Join the community to meet other builders.</li>
                        <li>Prepare for the kickoff session.</li>
                    </ul>
                    <p>Best regards,<br/>The Zaukriti Team</p>
                </div>
            `
        });
        console.log('Resend Delivery Log (Confirmation):', response);
    } catch (error) {
        console.error('Email Notification Error:', error);
    }
}

export async function sendFailureEmail(email: string, name: string) {
    try {
        const response = await resend.emails.send({
            from: 'Zaukriti TalentForge <talentforge@zaukriti.ai>',
            to: email,
            subject: 'Payment Status Update | Zaukriti TalentForge',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #ff9900;">Payment Verification Pending</h2>
                    <p>Hi ${name}, your recent attempt to enroll in TalentForge was not automatically confirmed by your bank/provider.</p>
                    <p><strong>What should you do?</strong></p>
                    <ul>
                        <li><strong>Wait 30 minutes:</strong> Our system will automatically check with Razorpay for a delayed confirmation.</li>
                        <li><strong>If successful:</strong> You will receive a "Welcome" email shortly.</li>
                        <li><strong>If it truly failed:</strong> You can try again after some time. Any deducted funds will be refunded by your bank within 5-7 days.</li>
                    </ul>
                    <p>We are monitoring this. If you need immediate help, reply to this email.</p>
                    <p>Best regards,<br/>The Zaukriti Team</p>
                </div>
            `
        });
        console.log('Resend Delivery Log (Failure):', response);
    } catch (error) {
        console.error('Failure Email Error:', error);
    }
}

export async function sendReferralRewardEmail(email: string, referrerName: string, referredName: string) {
    try {
        const response = await resend.emails.send({
            from: 'Zaukriti TalentForge <talentforge@zaukriti.ai>',
            to: email,
            subject: 'You Earned ₹50! | Zaukriti Referral Reward',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4ADE80;">Referral Success!</h2>
                    <p>Hi ${referrerName},</p>
                    <p>Great news! <strong>${referredName}</strong> just enrolled in TalentForge using your referral code.</p>
                    <div style="background: #f0fff4; padding: 20px; border-radius: 12px; border: 1px solid #4ADE80; margin: 20px 0; text-align: center;">
                        <span style="font-size: 1.2rem; font-weight: bold; color: #2D3748;">Reward Earned: ₹50</span>
                    </div>
                    <p>This amount will be credited back to your original payment method within 7-10 working days of the cohort kickoff.</p>
                    <p>Keep sharing your code to earn more!</p>
                    <p>Best regards,<br/>The Zaukriti Team</p>
                </div>
            `
        });
        console.log('Resend Delivery Log (Reward):', response);
    } catch (error) {
        console.error('Referral Reward Email Error:', error);
    }
}

export async function sendAdminAlertEmail(data: { email: string, referralCode: string | null, paymentId?: string, reason: string }) {
    try {
        const response = await resend.emails.send({
            from: 'Zaukriti Alert Bot <alerts@zaukriti.ai>',
            to: 'talentforge@zaukritievents.in',
            subject: '🔴 PAYMENT FAILURE ALERT | TalentForge',
            html: `
                <div style="font-family: monospace; color: #333; background: #fff5f5; padding: 20px; border: 1px solid #feb2b2;">
                    <h2 style="color: #c53030;">Payment Failure Alert</h2>
                    <ul>
                        <li><strong>User:</strong> ${data.email}</li>
                        <li><strong>Referral Code Used:</strong> ${data.referralCode || 'NONE'}</li>
                        <li><strong>Payment ID:</strong> ${data.paymentId || 'N/A'}</li>
                        <li><strong>Reason:</strong> ${data.reason}</li>
                    </ul>
                    <p>Please investigate in Razorpay Dashboard.</p>
                </div>
            `
        });
        console.log('Resend Delivery Log (Admin Alert):', response);
    } catch (error) {
        // Silent fail for admin alerts to not crash API
        console.error('Admin Alert Email Error:', error);
    }
}

export async function sendCommunityWelcomeEmail(email: string, name: string, organizationName: string, referralCode: string) {
    try {
        const shareUrl = encodeURIComponent(`https://zaukriti.ai/register?ref=${referralCode}`);

        const response = await resend.emails.send({
            from: 'Zaukriti Partnerships <partners@zaukriti.ai>',
            to: email,
            subject: 'Partner Code Ready | Zaukriti Ecosystem',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ffcc33;">Welcome Partner, ${name}!</h2>
                    <p>We are thrilled to have <strong>${organizationName}</strong> join the Zaukriti Ecosystem.</p>
                    
                    <div style="background: #fdf6e3; padding: 25px; border-radius: 12px; border: 1px solid #ffE5b4; margin: 25px 0; text-align: center;">
                        <h3 style="margin: 0; color: #d97706; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Your Partner Code</h3>
                        <div style="font-size: 32px; font-weight: bold; color: #d97706; margin: 15px 0; letter-spacing: 3px; font-family: monospace;">${referralCode}</div>
                        <p style="font-size: 14px; color: #78350f;">Share this code with your students/members.</p>
                        
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px dashed #d97706;">
                             <p style="font-size: 14px; margin-bottom: 5px;"><strong>Your Exclusive Referral Link:</strong></p>
                             <a href="https://zaukriti.ai/apply?ref=${referralCode}" style="color: #0284c7; word-break: break-all;">https://zaukriti.ai/apply?ref=${referralCode}</a>
                        </div>
                    </div>

                    <h3 style="color: #333;">Next Steps</h3>
                    <ul>
                        <li><strong>Share:</strong> Distribute your code to students. They get ₹50 off.</li>
                        <li><strong>Track:</strong> Use your code to track impact in your dashboard (coming soon).</li>
                        <li><strong>Earn:</strong> Rewards are credited to your institution/community wallet.</li>
                    </ul>
                    
                    <p>Building the future, together.</p>
                    <p>Best regards,<br/>Zaukriti Partnerships Team</p>
                </div>
            `
        });
        console.log('Resend Delivery Log (Community Welcome):', response);
    } catch (error) {
        console.error('Community Email Error:', error);
    }
}
