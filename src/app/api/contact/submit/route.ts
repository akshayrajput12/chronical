import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactFormSubmissionInput, ContactFormSubmissionResponse, SpamDetectionResult } from "@/types/contact";
import { web3FormsService, Web3FormsService } from "@/lib/services/web3forms";

// Simple spam detection function
function detectSpam(submission: ContactFormSubmissionInput): SpamDetectionResult {
    let score = 0;
    const reasons: string[] = [];

    // Check for common spam indicators
    const spamKeywords = [
        'viagra', 'casino', 'lottery', 'winner', 'congratulations',
        'click here', 'free money', 'make money fast', 'work from home',
        'guaranteed', 'no risk', 'limited time', 'act now'
    ];

    const text = `${submission.name} ${submission.message} ${submission.company_name || ''}`.toLowerCase();

    // Keyword check
    spamKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
            score += 0.3;
            reasons.push(`Contains spam keyword: ${keyword}`);
        }
    });

    // Excessive caps check
    const capsRatio = (submission.message.match(/[A-Z]/g) || []).length / submission.message.length;
    if (capsRatio > 0.5 && submission.message.length > 20) {
        score += 0.2;
        reasons.push('Excessive use of capital letters');
    }

    // Suspicious email patterns
    const suspiciousEmailPatterns = [
        /\d{5,}@/, // Many numbers in email
        /@[^.]+\.(tk|ml|ga|cf)$/, // Suspicious TLDs
    ];

    suspiciousEmailPatterns.forEach(pattern => {
        if (pattern.test(submission.email)) {
            score += 0.3;
            reasons.push('Suspicious email pattern');
        }
    });

    // Very short or very long messages
    if (submission.message.length < 10) {
        score += 0.2;
        reasons.push('Message too short');
    } else if (submission.message.length > 2000) {
        score += 0.1;
        reasons.push('Message unusually long');
    }

    // Repeated characters
    if (/(.)\1{4,}/.test(submission.message)) {
        score += 0.2;
        reasons.push('Contains repeated characters');
    }

    return {
        isSpam: score >= 0.5,
        score: Math.min(score, 1.0),
        reasons
    };
}

// POST /api/contact/submit - Submit contact form
export async function POST(request: NextRequest) {
    try {
        console.log("Contact form submission started");
        const supabase = await createClient(true); // Use service role for public form submissions

        const submissionData: ContactFormSubmissionInput = await request.json();
        console.log("Received submission data:", submissionData);

        // Validate required fields
        if (!submissionData.name?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Name is required"
            }, { status: 400 });
        }

        if (!submissionData.email?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Email is required"
            }, { status: 400 });
        }

        if (!submissionData.message?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Message is required"
            }, { status: 400 });
        }

        // Email validation
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(submissionData.email)) {
            return NextResponse.json({
                success: false,
                error: "Invalid email format"
            }, { status: 400 });
        }

        // Get client metadata
        const ip = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const referrer = request.headers.get('referer') || 'direct';

        // Spam detection
        const spamResult = detectSpam(submissionData);

        // Prepare submission data
        const submissionWithMetadata = {
            name: submissionData.name.trim(),
            exhibition_name: submissionData.exhibition_name?.trim() || null,
            company_name: submissionData.company_name?.trim() || null,
            email: submissionData.email.trim().toLowerCase(),
            phone: submissionData.phone?.trim() || null,
            budget: submissionData.budget?.trim() || null,
            message: submissionData.message.trim(),
            attachment_url: submissionData.attachment_url || null,
            attachment_filename: submissionData.attachment_filename || null,
            attachment_size: submissionData.attachment_size || null,
            attachment_type: submissionData.attachment_type || null,
            agreed_to_terms: submissionData.agreed_to_terms || false,
            status: spamResult.isSpam ? 'spam' : 'new',
            is_spam: spamResult.isSpam,
            spam_score: spamResult.score,
            ip_address: ip,
            user_agent: userAgent,
            referrer: referrer
        };

        // Insert submission into database
        console.log("Inserting submission with metadata:", submissionWithMetadata);
        const { data: insertedSubmission, error: insertError } = await supabase
            .from("contact_form_submissions")
            .insert(submissionWithMetadata)
            .select()
            .single();

        if (insertError) {
            console.error("Database insert error:", insertError);
            console.error("Error details:", {
                message: insertError.message,
                details: insertError.details,
                hint: insertError.hint,
                code: insertError.code
            });
            throw insertError;
        }

        console.log("Successfully inserted submission:", insertedSubmission);

        // Log spam detection if applicable
        if (spamResult.isSpam) {
            console.log("Spam submission detected:", {
                id: insertedSubmission.id,
                score: spamResult.score,
                reasons: spamResult.reasons,
                email: submissionData.email
            });
        }

        // Send email notification via Web3Forms (only for non-spam submissions)
        if (!spamResult.isSpam) {
            try {
                const formType = Web3FormsService.getFormTypeFromMessage(submissionData.message);
                const baseUrl = request.headers.get('origin') || 'https://chronicleexhibits.ae';
                const submissionUrl = `${baseUrl}/admin/contact/submissions`;

                // Extract event ID from message if it's an event inquiry
                let eventId: string | undefined;
                if (formType === 'event') {
                    const eventIdMatch = submissionData.message.match(/Event ID: ([a-f0-9-]+)/);
                    eventId = eventIdMatch ? eventIdMatch[1] : undefined;
                }

                await web3FormsService.sendFormNotification({
                    name: submissionData.name,
                    email: submissionData.email,
                    phone: submissionData.phone,
                    exhibition_name: submissionData.exhibition_name,
                    company_name: submissionData.company_name,
                    budget: submissionData.budget,
                    message: submissionData.message,
                    form_type: formType,
                    event_id: eventId,
                    submission_url: submissionUrl,
                    referrer: referrer
                });

                console.log("Email notification sent successfully via Web3Forms");
            } catch (emailError) {
                console.error("Failed to send email notification:", emailError);
                // Don't fail the entire request if email fails
                // The form submission is still saved in the database
            }
        }

        const response: ContactFormSubmissionResponse = {
            success: true,
            data: insertedSubmission
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("Contact form submission error:", error);
        
        const response: ContactFormSubmissionResponse = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to submit contact form"
        };

        return NextResponse.json(response, { status: 500 });
    }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
