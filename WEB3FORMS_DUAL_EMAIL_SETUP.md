# Web3Forms Dual Email Setup Instructions

## Overview
The Web3Forms service has been updated to send form submissions to **two email addresses** using **two separate access keys**. This ensures that form data reaches both recipients simultaneously.

## Setup Instructions

### Step 1: Get Your Second Access Key
1. Go to [Web3Forms.com](https://web3forms.com)
2. Create a new form for your second email address
3. Copy the access key provided

### Step 2: Update the Configuration
Open the file: `src/lib/services/web3forms.ts`

Find this line:
```typescript
private readonly accessKey2 = 'YOUR_SECOND_ACCESS_KEY_HERE'; // Add your second access key here
```

Replace `'YOUR_SECOND_ACCESS_KEY_HERE'` with your actual second access key:
```typescript
private readonly accessKey2 = 'your-actual-second-access-key-here';
```

## How It Works

### Current Configuration
- **Access Key 1**: `0c2e5f6f-5e07-48ef-8faf-6193752e0611` (existing)
- **Access Key 2**: `YOUR_SECOND_ACCESS_KEY_HERE` (needs to be updated)

### Dual Submission Process
1. When a form is submitted, the service creates the email content
2. It sends the **same form data** to **both access keys simultaneously**
3. Each access key corresponds to a different email address
4. Both emails receive identical form submission data

### Error Handling
- If **both submissions fail**: The form submission fails with an error
- If **one submission fails**: The form submission succeeds, but a warning is logged
- If **both submissions succeed**: Full success with confirmation

### Form Types Supported
All existing form types continue to work with dual email delivery:
- Contact forms (`contact`)
- Booth requirement forms (`booth`)
- Event inquiry forms (`event`)
- Quotation request forms (`quotation`)

## Benefits
- **Redundancy**: If one email fails, the other still receives the submission
- **Multiple Recipients**: Two different people/departments can receive form data
- **Same Data**: Both emails receive identical, formatted content
- **Automatic**: No changes needed to existing forms or components

## Testing
After updating your second access key:
1. Submit a test form on your website
2. Check that both email addresses receive the submission
3. Verify the content is identical in both emails

## Troubleshooting
- Check browser console for any error messages
- Verify both access keys are valid and active
- Ensure both email addresses are correctly configured in Web3Forms
- Test each access key individually if needed

## File Location
The configuration file is located at:
```
src/lib/services/web3forms.ts
```

## Support
If you encounter issues:
1. Check the browser console for error messages
2. Verify your Web3Forms account settings
3. Test with a single access key first to isolate issues
