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
    private readonly accessKey1 = '0c2e5f6f-5e07-48ef-8faf-6193752e0611';
    private readonly accessKey2 = 'YOUR_SECOND_ACCESS_KEY_HERE'; // Add your second access key here

    /**
     * Send email notification via Web3Forms to both access keys
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

            // Create base submission data
            const baseSubmissionData = {
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

            console.log('Sending Web3Forms notification to both access keys:', {
                subject: baseSubmissionData.subject,
                email: baseSubmissionData.email,
                form_type: baseSubmissionData.form_type
            });

            // Send to both access keys simultaneously
            const [result1, result2] = await Promise.allSettled([
                this.sendToAccessKey({ ...baseSubmissionData, access_key: this.accessKey1 }),
                this.sendToAccessKey({ ...baseSubmissionData, access_key: this.accessKey2 })
            ]);

            // Check results
            const success1 = result1.status === 'fulfilled' && result1.value.success;
            const success2 = result2.status === 'fulfilled' && result2.value.success;

            if (!success1 && !success2) {
                const error1 = result1.status === 'rejected' ? result1.reason : result1.value.body?.message;
                const error2 = result2.status === 'rejected' ? result2.reason : result2.value.body?.message;
                console.error('Both Web3Forms submissions failed:', { error1, error2 });
                throw new Error(`Both Web3Forms submissions failed. Error 1: ${error1}, Error 2: ${error2}`);
            }

            if (!success1) {
                const error1 = result1.status === 'rejected' ? result1.reason : result1.value.body?.message;
                console.warn('First Web3Forms submission failed:', error1);
            }

            if (!success2) {
                const error2 = result2.status === 'rejected' ? result2.reason : result2.value.body?.message;
                console.warn('Second Web3Forms submission failed:', error2);
            }

            const successfulResult = success1 ? (result1 as PromiseFulfilledResult<Web3FormsResponse>).value : (result2 as PromiseFulfilledResult<Web3FormsResponse>).value;
            console.log(`Web3Forms notification sent successfully to ${success1 && success2 ? 'both' : 'one'} access key(s):`, successfulResult.body?.message);

            return successfulResult;

        } catch (error) {
            console.error('Error sending Web3Forms notification:', error);
            throw error;
        }
    }

    /**
     * Send form data to a specific access key
     */
    private async sendToAccessKey(submissionData: Web3FormsSubmissionData): Promise<Web3FormsResponse> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData)
        });

        const result: Web3FormsResponse = await response.json();

        if (!result.success) {
            console.error('Web3Forms API error for access key:', submissionData.access_key, result);
            throw new Error(`Web3Forms API error: ${result.body?.message || 'Unknown error'}`);
        }

        return result;
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
