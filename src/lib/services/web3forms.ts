/**
 * Web3Forms Email Service
 * Handles sending emails via Web3Forms API for form submissions
 */

export interface Web3FormsSubmissionData {
    access_key: string;
    subject: string;
    email: string;
    replyto?: string;
    name: string;
    exhibition_name?: string;
    company_name?: string;
    phone?: string;
    budget?: string;
    message: string;
    form_type: string;
    event_id?: string;
    submission_url?: string;
    referrer?: string;
    botcheck?: boolean;
}

export interface Web3FormsResponse {
    success: boolean;
    statusCode: number;
    body: {
        data: any;
        message: string;
    };
}

export class Web3FormsService {
    private readonly apiUrl = 'https://api.web3forms.com/submit';
    private readonly accessKey = '0c2e5f6f-5e07-48ef-8faf-6193752e0611';

    /**
     * Send email notification via Web3Forms
     */
    async sendFormNotification(data: {
        name: string;
        email: string;
        phone?: string;
        exhibition_name?: string;
        company_name?: string;
        budget?: string;
        message: string;
        form_type: 'contact' | 'booth' | 'event' | 'quotation';
        event_id?: string;
        submission_url?: string;
        referrer?: string;
    }): Promise<Web3FormsResponse> {
        try {
            // Determine email subject based on form type
            const subjects = {
                contact: 'New Contact Form Submission',
                booth: 'New Booth Requirements Submission',
                event: 'New Event Inquiry Submission',
                quotation: 'New Quotation Request Submission'
            };

            // Format the email content with all form data
            const emailContent = this.formatEmailContent(data);

            const submissionData: Web3FormsSubmissionData = {
                access_key: this.accessKey,
                subject: subjects[data.form_type],
                email: data.email,
                replyto: data.email,
                name: data.name,
                exhibition_name: data.exhibition_name,
                company_name: data.company_name,
                phone: data.phone,
                budget: data.budget,
                message: emailContent,
                form_type: data.form_type,
                event_id: data.event_id,
                submission_url: data.submission_url,
                referrer: data.referrer,
                botcheck: false // Hidden field for spam protection
            };

            console.log('Sending Web3Forms notification:', {
                subject: submissionData.subject,
                email: submissionData.email,
                form_type: submissionData.form_type
            });

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            const result: Web3FormsResponse = await response.json();

            if (!result.success) {
                console.error('Web3Forms API error:', result);
                throw new Error(`Web3Forms API error: ${result.body?.message || 'Unknown error'}`);
            }

            console.log('Web3Forms notification sent successfully:', result.body?.message);
            return result;

        } catch (error) {
            console.error('Error sending Web3Forms notification:', error);
            throw error;
        }
    }

    /**
     * Format email content with all form data
     */
    private formatEmailContent(data: {
        name: string;
        email: string;
        phone?: string;
        exhibition_name?: string;
        company_name?: string;
        budget?: string;
        message: string;
        form_type: string;
        event_id?: string;
        submission_url?: string;
        referrer?: string;
    }): string {
        const formTypeLabels = {
            contact: 'Contact Form',
            booth: 'Booth Requirements',
            event: 'Event Inquiry',
            quotation: 'Quotation Request'
        };

        const formTypeIcons = {
            contact: '📞',
            booth: '🏢',
            event: '🎪',
            quotation: '💰'
        };

        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });

        let content = `
🌟 ═══════════════════════════════════════════════════════════════
   ${formTypeIcons[data.form_type as keyof typeof formTypeIcons]} NEW ${formTypeLabels[data.form_type as keyof typeof formTypeLabels].toUpperCase()} SUBMISSION
🌟 ═══════════════════════════════════════════════════════════════

👤 CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Name: ${data.name}
✉️  Email: ${data.email}`;

        if (data.phone) {
            content += `\n📱 Phone: ${data.phone}`;
        }

        if (data.company_name) {
            content += `\n🏢 Company: ${data.company_name}`;
        }

        if (data.exhibition_name) {
            content += `\n🎪 Exhibition: ${data.exhibition_name}`;
        }

        if (data.budget) {
            content += `\n💰 Budget: ${data.budget}`;
        }

        content += `\n\n💬 CUSTOMER MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}`;

        if (data.event_id) {
            content += `\n\n🎯 EVENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 Event ID: ${data.event_id}`;
        }

        content += `\n\n📊 SUBMISSION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Form Type: ${formTypeLabels[data.form_type as keyof typeof formTypeLabels]}
🌐 Source: ${data.referrer ? new URL(data.referrer).pathname : 'Direct Access'}`;

        if (data.submission_url) {
            content += `\n🔗 Admin Panel: ${data.submission_url}`;
        }

        content += `\n📅 Submitted: ${currentDate}

═══════════════════════════════════════════════════════════════
🏢 CHRONICLES DUBAI - EXHIBITION SOLUTIONS
📧 This is an automated notification from Chronicles Dubai website
💡 Reply to this email to respond directly to the customer
═══════════════════════════════════════════════════════════════`;

        return content;
    }

    /**
     * Determine form type from message content
     */
    static getFormTypeFromMessage(message: string): 'contact' | 'booth' | 'event' | 'quotation' {
        if (message.includes('[CONTACT FORM]')) return 'contact';
        if (message.includes('[BOOTH REQUIREMENTS]')) return 'booth';
        if (message.includes('[EVENT INQUIRY]')) return 'event';
        if (message.includes('[QUOTATION REQUEST]')) return 'quotation';
        return 'contact'; // default
    }
}

export const web3FormsService = new Web3FormsService();
