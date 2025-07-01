"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function RequestQuotationDialog({
    trigger,
}: {
    trigger: React.ReactNode;
}) {
    const [form, setForm] = React.useState({
        name: "",
        exhibitionName: "",
        companyName: "",
        email: "",
        phone: "",
        budget: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(res => setTimeout(res, 1200));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 2000);
        setForm({
            name: "",
            exhibitionName: "",
            companyName: "",
            email: "",
            phone: "",
            budget: "",
            message: "",
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="lg:max-w-xl w-full rounded-xl p-0 overflow-hidden">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 space-y-4"
                >
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#a5cd39]">
                            Request a Quotation
                        </DialogTitle>
                    </DialogHeader>
                    {isSubmitted ? (
                        <div className="text-center py-8">
                            <div className="text-3xl mb-2">✅</div>
                            <div className="font-semibold text-lg text-gray-700">
                                Thank you! We'll contact you soon.
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label htmlFor="name">Full Name*</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        className="h-8"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="exhibitionName">
                                        Exhibition Name*
                                    </Label>
                                    <Input
                                        id="exhibitionName"
                                        name="exhibitionName"
                                        value={form.exhibitionName}
                                        className="h-8"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="companyName">
                                        Company Name*
                                    </Label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        value={form.companyName}
                                        className="h-8"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">
                                        Email Address*
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        className="h-8"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone Number*</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={form.phone}
                                        className="h-8"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="budget">Budget</Label>
                                    <Input
                                        id="budget"
                                        name="budget"
                                        value={form.budget}
                                        className="h-8"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="message">
                                        Your Message*
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter className="mt-4 flex justify-between items-center">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    className="bg-[#a5cd39] hover:bg-[#8aaa30] text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Sending..."
                                        : "Send Request"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
