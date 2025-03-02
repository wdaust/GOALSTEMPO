import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  BookOpen,
  Clock,
  Target,
  User,
  BookMarked,
  Ban,
  AlertCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const habitFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Habit name must be at least 2 characters." }),
  type: z.string(),
  goal: z.string().min(1, { message: "Please set a goal." }),
  frequency: z.string(),
  reminderTime: z.string().optional(),
  notes: z.string().optional(),
  reasons: z.string().optional(),
  alternatives: z.string().optional(),
});

type HabitFormValues = z.infer<typeof habitFormSchema>;

interface AddHabitDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddHabit?: (habit: HabitFormValues) => void;
}

const defaultValues: Partial<HabitFormValues> = {
  name: "",
  type: "bible-reading",
  goal: "",
  frequency: "daily",
  reminderTime: "",
  notes: "",
  reasons: "",
  alternatives: "",
};

const HABIT_TEMPLATES = [
  {
    id: "bible-reading",
    name: "Bible Reading",
    icon: <BookMarked className="h-5 w-5" />,
    defaultName: "Daily Bible Reading",
    defaultGoal: "3 chapters per day",
    defaultFrequency: "daily",
  },
  {
    id: "meeting",
    name: "Meeting Attendance",
    icon: <User className="h-5 w-5" />,
    defaultName: "Midweek Meeting",
    defaultGoal: "Attend every week",
    defaultFrequency: "weekly",
  },
  {
    id: "field-service",
    name: "Field Service",
    icon: <BookOpen className="h-5 w-5" />,
    defaultName: "Field Service",
    defaultGoal: "10 hours per month",
    defaultFrequency: "monthly",
  },
  {
    id: "break-habit",
    name: "Break Bad Habit",
    icon: <Ban className="h-5 w-5" />,
    defaultName: "Break Bad Habit",
    defaultGoal: "Avoid this habit completely",
    defaultFrequency: "daily",
  },
];

const AddHabitDialog = ({
  open = true,
  onOpenChange,
  onAddHabit,
}: AddHabitDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues,
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = HABIT_TEMPLATES.find((t) => t.id === templateId);

    if (template) {
      form.setValue("type", templateId);
      form.setValue("name", template.defaultName);
      form.setValue("goal", template.defaultGoal);
      form.setValue("frequency", template.defaultFrequency);
    } else {
      // Custom habit
      form.setValue("type", "custom");
      form.setValue("name", "");
      form.setValue("goal", "");
      form.setValue("frequency", "daily");
    }
  };

  function onSubmit(data: HabitFormValues) {
    if (onAddHabit) {
      onAddHabit(data);
    }
    form.reset();
    setSelectedTemplate(null);
    if (onOpenChange) {
      onOpenChange(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80vh] overflow-y-auto px-4 py-6 sm:px-6 rounded-t-xl"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Add New Spiritual Habit</SheetTitle>
          <SheetDescription>
            Choose a habit type or create your own
          </SheetDescription>
        </SheetHeader>

        {!selectedTemplate ? (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {HABIT_TEMPLATES.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="flex items-center justify-start h-16 p-4 text-left"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="mr-4 bg-primary/10 p-2 rounded-full">
                  {template.icon}
                </div>
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {template.defaultGoal}
                  </div>
                </div>
              </Button>
            ))}
            <Button
              variant="outline"
              className="flex items-center justify-start h-16 p-4 text-left"
              onClick={() => handleTemplateSelect("custom")}
            >
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Custom Habit</div>
                <div className="text-sm text-muted-foreground">
                  Create your own spiritual habit
                </div>
              </div>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habit Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter habit name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal</FormLabel>
                      <FormControl>
                        <Input placeholder="Set a measurable goal" {...field} />
                      </FormControl>
                      <FormDescription>
                        {selectedTemplate === "break-habit"
                          ? "Example: 'Stay free from this habit for 30 days'"
                          : "Examples: '3 chapters per day' or '10 hours per month'"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedTemplate === "break-habit" && (
                  <>
                    <FormField
                      control={form.control}
                      name="reasons"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reasons to Break This Habit</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List your reasons for wanting to break this habit..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Remembering your reasons will help you stay
                            motivated
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alternatives"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Positive Alternatives</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What positive habits can replace this negative one?"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Having alternatives ready will help you avoid
                            triggers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="reminderTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder (Optional)</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Set a reminder to help you stay consistent
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SheetFooter className="mt-6 flex flex-col space-y-2">
                <Button type="submit" className="w-full rounded-full">
                  <Target className="mr-2 h-4 w-4" />
                  Create Habit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Back to Templates
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AddHabitDialog;
