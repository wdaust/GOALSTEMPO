import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, User, Shield, Send } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Partner's name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPartnerDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddPartner?: (data: FormValues) => void;
}

const AddPartnerDialog = ({
  open = true,
  onOpenChange,
  onAddPartner,
}: AddPartnerDialogProps) => {
  const [step, setStep] = useState<"invite" | "privacy">("invite");
  const [privacySettings, setPrivacySettings] = useState({
    shareHabits: true,
    shareGoals: true,
    shareJournal: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message:
        "I would like to add you as an accountability partner in KHGoals.",
    },
  });

  const handleSubmit = (data: FormValues) => {
    if (step === "invite") {
      setStep("privacy");
    } else {
      onAddPartner?.(data);
      onOpenChange?.(false);
    }
  };

  const togglePrivacySetting = (setting: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {step === "invite"
              ? "Add Accountability Partner"
              : "Privacy Settings"}
          </DialogTitle>
          <DialogDescription>
            {step === "invite"
              ? "Send an invitation to someone to be your accountability partner."
              : "Choose what you want to share with your partner."}
          </DialogDescription>
        </DialogHeader>

        {step === "invite" ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner's Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="John Smith" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="partner@example.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invitation Message</FormLabel>
                    <FormControl>
                      <Input as="textarea" className="h-20" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add a personal message to your invitation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" className="w-full">
                  Next
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Share Habits</span>
                </div>
                <Button
                  variant={privacySettings.shareHabits ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePrivacySetting("shareHabits")}
                >
                  {privacySettings.shareHabits ? "Sharing" : "Not Sharing"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Share Goals</span>
                </div>
                <Button
                  variant={privacySettings.shareGoals ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePrivacySetting("shareGoals")}
                >
                  {privacySettings.shareGoals ? "Sharing" : "Not Sharing"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Share Journal</span>
                </div>
                <Button
                  variant={privacySettings.shareJournal ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePrivacySetting("shareJournal")}
                >
                  {privacySettings.shareJournal ? "Sharing" : "Not Sharing"}
                </Button>
              </div>
            </div>

            <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
              <Button
                onClick={() => form.handleSubmit(handleSubmit)()}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send Invitation</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("invite")}
                className="w-full"
              >
                Back
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPartnerDialog;
