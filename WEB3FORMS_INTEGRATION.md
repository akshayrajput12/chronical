# Web3Forms Email Integration

## Overview

This document describes the Web3Forms email integration for Chronicles Dubai website. All form submissions (Contact, Booth Requirements, Event Inquiries, and Quotation Requests) now automatically send email notifications using Web3Forms API.

## Features

✅ **Unified Email System**: All forms use the same email notification system
✅ **Rich Email Content**: Emails include all form data, not just basic information
✅ **Form Type Detection**: Automatically detects and labels different form types
✅ **Spam Protection**: Only non-spam submissions trigger email notifications
✅ **Error Handling**: Email failures don't break form submissions
✅ **Admin Links**: Emails include direct links to admin interface

## Configuration

### API Key
- **Web3Forms API Key**: `0c2e5f6f-5e07-48ef-8faf-6193752e0611`
- **Service File**: `src/lib/services/web3forms.ts`

### Email Recipients
Configure your email address in the Web3Forms dashboard at https://web3forms.com/

## Form Types Supported

### 1. Contact Form
- **Trigger**: Message contains `[CONTACT FORM]`
- **Subject**: "New Contact Form Submission"
- **Fields**: Name, Email, Phone, Company, Exhibition, Message, Attachments

### 2. Booth Requirements Form
- **Trigger**: Message contains `[BOOTH REQUIREMENTS]`
- **Subject**: "New Booth Requirements Submission"
- **Fields**: Name, Email, Phone, Company, Exhibition, Budget, Message, Attachments

### 3. Event Inquiry Form
- **Trigger**: Message contains `[EVENT INQUIRY]`
- **Subject**: "New Event Inquiry Submission"
- **Fields**: Name, Email, Phone, Company, Exhibition, Budget, Message, Event ID

### 4. Quotation Request Form
- **Trigger**: Message contains `[QUOTATION REQUEST]`
- **Subject**: "New Quotation Request Submission"
- **Fields**: Name, Email, Phone, Company, Exhibition, Budget, Message

## Email Content Format

Each email includes beautifully formatted content:

```
🌟 ═══════════════════════════════════════════════════════════════
   🏢 NEW BOOTH REQUIREMENTS SUBMISSION
🌟 ═══════════════════════════════════════════════════════════════

👤 CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Name: [Customer Name]
✉️  Email: [Customer Email]
📱 Phone: [Customer Phone]
🏢 Company: [Company Name]
🎪 Exhibition: [Exhibition Name]
💰 Budget: [Budget Range]

💬 CUSTOMER MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Customer Message]

🎯 EVENT DETAILS (for event inquiries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 Event ID: [Event ID]

📊 SUBMISSION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Form Type: [Form Type]
🌐 Source: [Page Path]
🔗 Admin Panel: [Direct link to admin]
📅 Submitted: [Formatted Date & Time]

═══════════════════════════════════════════════════════════════
🏢 CHRONICLES DUBAI - EXHIBITION SOLUTIONS
📧 This is an automated notification from Chronicles Dubai website
💡 Reply to this email to respond directly to the customer
═══════════════════════════════════════════════════════════════
```

## Technical Implementation

### 1. Service Class
```typescript
// src/lib/services/web3forms.ts
export class Web3FormsService {
    private readonly apiUrl = 'https://api.web3forms.com/submit';
    private readonly accessKey = '0c2e5f6f-5e07-48ef-8faf-6193752e0611';
    
    async sendFormNotification(data: FormData): Promise<Web3FormsResponse>
}
```

### 2. API Integration
```typescript
// src/app/api/contact/submit/route.ts
import { web3FormsService } from "@/lib/services/web3forms";

// After successful database insertion:
await web3FormsService.sendFormNotification({
    name, email, phone, company_name, message, form_type, ...
});
```

### 3. Form Type Detection
```typescript
static getFormTypeFromMessage(message: string): FormType {
    if (message.includes('[CONTACT FORM]')) return 'contact';
    if (message.includes('[BOOTH REQUIREMENTS]')) return 'booth';
    if (message.includes('[EVENT INQUIRY]')) return 'event';
    if (message.includes('[QUOTATION REQUEST]')) return 'quotation';
    return 'contact'; // default
}
```

## Email Sample

When someone submits a booth requirements form, you'll receive:

```
Subject: New Booth Requirements Submission

🌟 ═══════════════════════════════════════════════════════════════
   🏢 NEW BOOTH REQUIREMENTS SUBMISSION
🌟 ═══════════════════════════════════════════════════════════════

👤 CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Name: John Smith
✉️  Email: john@company.com
📱 Phone: +971 50 123 4567
🏢 Company: Smith Exhibitions
🎪 Exhibition: Dubai Expo 2024
💰 Budget: 10000-20000

💬 CUSTOMER MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
We need a 3x3 booth for the upcoming exhibition...

📊 SUBMISSION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Form Type: Booth Requirements
🌐 Source: /booth-requirements
🔗 Admin Panel: https://chronicleexhibits.ae/admin/contact/submissions
📅 Submitted: Monday, January 15, 2024 at 10:30 AM GST

═══════════════════════════════════════════════════════════════
🏢 CHRONICLES DUBAI - EXHIBITION SOLUTIONS
📧 This is an automated notification from Chronicles Dubai website
💡 Reply to this email to respond directly to the customer
═══════════════════════════════════════════════════════════════
```

## Testing

### Manual Testing
1. Start the development server: `npm run dev`
2. Run the test script: `node test-web3forms.js`
3. Check your email inbox for notifications

### Test Script Features
- Tests all 4 form types
- Includes realistic test data
- Provides detailed success/failure feedback
- Includes rate limiting between requests

## Error Handling

### Email Failures
- Email failures are logged but don't break form submissions
- Form data is still saved to database
- Admin can still view submissions in admin interface

### Spam Protection
- Spam submissions don't trigger email notifications
- Reduces email noise and potential abuse

## Monitoring

### Logs
Check server logs for:
```
✅ "Email notification sent successfully via Web3Forms"
❌ "Failed to send email notification: [error]"
```

### Web3Forms Dashboard
- Monitor email delivery status
- View usage statistics
- Configure email settings

## Troubleshooting

### No Emails Received
1. ✅ Check Web3Forms API key is correct
2. ✅ Verify email address in Web3Forms dashboard
3. ✅ Check spam/junk folder
4. ✅ Review server logs for errors
5. ✅ Test with `node test-web3forms.js`

### Email Content Issues
1. ✅ Check form message prefixes (`[CONTACT FORM]`, etc.)
2. ✅ Verify form data is being passed correctly
3. ✅ Review `formatEmailContent()` method

### API Errors
1. ✅ Check Web3Forms service status
2. ✅ Verify API key permissions
3. ✅ Review request/response logs

## Future Enhancements

- [ ] Email templates with HTML formatting
- [ ] Attachment forwarding (currently only metadata)
- [ ] Auto-responder emails to customers
- [ ] Email analytics and tracking
- [ ] Multiple recipient support
- [ ] Custom email subjects per form

## Support

- **Web3Forms Documentation**: https://docs.web3forms.com/
- **API Reference**: https://docs.web3forms.com/getting-started/api-reference
- **Dashboard**: https://web3forms.com/dashboard
