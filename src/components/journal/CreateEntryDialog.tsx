import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookOpen, Calendar, Save, Lightbulb } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters." }),
  promptType: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateEntryDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreateEntry?: (data: FormValues) => void;
}

const REFLECTION_PROMPTS = [
  "How did I see Jehovah's hand in my life today?",
  "What scripture encouraged me this week and why?",
  "How did I grow spiritually this month?",
  "What challenges am I facing in my ministry, and how can I overcome them?",
  "What am I grateful for in my spiritual life?",
  "How can I improve my personal study habits?",
  "What spiritual goals would I like to set for the coming month?",
];

const CreateEntryDialog = ({
  open = true,
  onOpenChange,
  onCreateEntry,
}: CreateEntryDialogProps) => {
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      promptType: "",
    },
  });

  const handlePromptSelect = (promptIndex: string) => {
    const index = parseInt(promptIndex);
    if (index >= 0 && index < REFLECTION_PROMPTS.length) {
      setSelectedPrompt(REFLECTION_PROMPTS[index]);
      form.setValue("content", REFLECTION_PROMPTS[index] + "\n\n");
      form.setValue("promptType", promptIndex);
    }
  };

  const onSubmit = (data: FormValues) => {
    onCreateEntry?.(data);
    form.reset();
    setSelectedPrompt("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Journal Entry</DialogTitle>
          <DialogDescription>
            Record your spiritual thoughts, experiences, and reflections.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Title</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Weekly Reflection" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Use a Reflection Prompt</FormLabel>
              <div className="flex items-center space-x-2 mt-1">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                <Select
                  onValueChange={handlePromptSelect}
                  value={form.watch("promptType") || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prompt (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {REFLECTION_PROMPTS.map((prompt, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {prompt.length > 50
                          ? prompt.substring(0, 50) + "..."
                          : prompt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journal Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your thoughts here..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Today's Date: {new Date().toLocaleDateString()}</span>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEntryDialog;
