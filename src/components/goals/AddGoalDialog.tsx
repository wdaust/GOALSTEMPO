import React, { useState } from "react";
import {
  PlusCircle,
  Calendar,
  Target,
  BookOpen,
  Languages,
  Bookmark,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubgoalType {
  id: string;
  title: string;
  completed: boolean;
}

interface GoalType {
  id: string;
  title: string;
  description: string;
  type: string;
  deadline: string;
  subgoals: SubgoalType[];
}

interface AddGoalDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddGoal?: (goal: GoalType) => void;
}

const AddGoalDialog = ({
  open = true,
  onOpenChange,
  onAddGoal,
}: AddGoalDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("custom");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [subgoals, setSubgoals] = useState<SubgoalType[]>([
    { id: "1", title: "First step", completed: false },
    { id: "2", title: "Second step", completed: false },
  ]);
  const [newSubgoal, setNewSubgoal] = useState("");

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);

    // Populate with template-specific defaults
    if (template === "pioneering") {
      setGoalTitle("Auxiliary Pioneering");
      setGoalDescription("Dedicate 30 hours to the ministry this month");
      setSubgoals([
        { id: "1", title: "Schedule time for ministry", completed: false },
        { id: "2", title: "Prepare presentations", completed: false },
        { id: "3", title: "Find a ministry partner", completed: false },
      ]);
    } else if (template === "language") {
      setGoalTitle("Learn a New Language");
      setGoalDescription("Study a new language to expand my ministry");
      setSubgoals([
        { id: "1", title: "Complete basic vocabulary", completed: false },
        { id: "2", title: "Practice with a fluent speaker", completed: false },
        {
          id: "3",
          title: "Give a presentation in new language",
          completed: false,
        },
      ]);
    } else if (template === "scripture") {
      setGoalTitle("Scripture Memorization");
      setGoalDescription("Memorize key Bible verses");
      setSubgoals([
        {
          id: "1",
          title: "Select 10 scriptures to memorize",
          completed: false,
        },
        { id: "2", title: "Practice daily recitation", completed: false },
        { id: "3", title: "Use in ministry conversations", completed: false },
      ]);
    } else {
      // Custom template - reset fields
      setGoalTitle("");
      setGoalDescription("");
      setSubgoals([
        { id: "1", title: "First step", completed: false },
        { id: "2", title: "Second step", completed: false },
      ]);
    }
  };

  const addSubgoal = () => {
    if (newSubgoal.trim()) {
      setSubgoals([
        ...subgoals,
        { id: Date.now().toString(), title: newSubgoal, completed: false },
      ]);
      setNewSubgoal("");
    }
  };

  const removeSubgoal = (id: string) => {
    setSubgoals(subgoals.filter((subgoal) => subgoal.id !== id));
  };

  const handleSubmit = () => {
    const newGoal: GoalType = {
      id: Date.now().toString(),
      title: goalTitle,
      description: goalDescription,
      type: selectedTemplate,
      deadline: goalDeadline,
      subgoals: subgoals,
    };

    if (onAddGoal) {
      onAddGoal(newGoal);
    }

    // Reset form
    setGoalTitle("");
    setGoalDescription("");
    setGoalDeadline("");
    setSubgoals([
      { id: "1", title: "First step", completed: false },
      { id: "2", title: "Second step", completed: false },
    ]);
    setSelectedTemplate("custom");

    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const getTemplateIcon = (template: string) => {
    switch (template) {
      case "pioneering":
        return <Target className="h-5 w-5 mr-2" />;
      case "language":
        return <Languages className="h-5 w-5 mr-2" />;
      case "scripture":
        return <BookOpen className="h-5 w-5 mr-2" />;
      default:
        return <PlusCircle className="h-5 w-5 mr-2" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Add New Spiritual Goal</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="custom"
          value={selectedTemplate}
          onValueChange={handleTemplateSelect}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger
              value="custom"
              className="flex items-center justify-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Custom
            </TabsTrigger>
            <TabsTrigger
              value="pioneering"
              className="flex items-center justify-center"
            >
              <Target className="h-4 w-4 mr-2" /> Pioneering
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className="flex items-center justify-center"
            >
              <Languages className="h-4 w-4 mr-2" /> Language
            </TabsTrigger>
            <TabsTrigger
              value="scripture"
              className="flex items-center justify-center"
            >
              <BookOpen className="h-4 w-4 mr-2" /> Scripture
            </TabsTrigger>
          </TabsList>

          {/* All template content is controlled by the same form, just with different defaults */}
          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="goal-title"
                  className="block text-sm font-medium mb-1"
                >
                  Goal Title
                </label>
                <Input
                  id="goal-title"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Enter your goal title"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="goal-description"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Describe your spiritual goal"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-deadline"
                  className="block text-sm font-medium mb-1"
                >
                  Target Date
                </label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">
                    Subgoals / Steps
                  </label>
                  <span className="text-xs text-gray-500">
                    {subgoals.length} steps
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {subgoals.map((subgoal) => (
                    <div
                      key={subgoal.id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{subgoal.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubgoal(subgoal.id)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newSubgoal}
                    onChange={(e) => setNewSubgoal(e.target.value)}
                    placeholder="Add a step"
                    onKeyDown={(e) => e.key === "Enter" && addSubgoal()}
                  />
                  <Button onClick={addSubgoal} type="button" variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pioneering" className="space-y-4 mt-4">
            {/* Same form as custom, but with pioneering defaults */}
            <div className="space-y-4">
              {/* Form fields identical to custom tab */}
              <div>
                <label
                  htmlFor="goal-title"
                  className="block text-sm font-medium mb-1"
                >
                  Goal Title
                </label>
                <Input
                  id="goal-title"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Enter your goal title"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="goal-description"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Describe your spiritual goal"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-deadline"
                  className="block text-sm font-medium mb-1"
                >
                  Target Date
                </label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">
                    Subgoals / Steps
                  </label>
                  <span className="text-xs text-gray-500">
                    {subgoals.length} steps
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {subgoals.map((subgoal) => (
                    <div
                      key={subgoal.id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{subgoal.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubgoal(subgoal.id)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newSubgoal}
                    onChange={(e) => setNewSubgoal(e.target.value)}
                    placeholder="Add a step"
                    onKeyDown={(e) => e.key === "Enter" && addSubgoal()}
                  />
                  <Button onClick={addSubgoal} type="button" variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-4 mt-4">
            {/* Same form as custom, but with language learning defaults */}
            <div className="space-y-4">
              {/* Form fields identical to custom tab */}
              <div>
                <label
                  htmlFor="goal-title"
                  className="block text-sm font-medium mb-1"
                >
                  Goal Title
                </label>
                <Input
                  id="goal-title"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Enter your goal title"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="goal-description"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Describe your spiritual goal"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-deadline"
                  className="block text-sm font-medium mb-1"
                >
                  Target Date
                </label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">
                    Subgoals / Steps
                  </label>
                  <span className="text-xs text-gray-500">
                    {subgoals.length} steps
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {subgoals.map((subgoal) => (
                    <div
                      key={subgoal.id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{subgoal.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubgoal(subgoal.id)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newSubgoal}
                    onChange={(e) => setNewSubgoal(e.target.value)}
                    placeholder="Add a step"
                    onKeyDown={(e) => e.key === "Enter" && addSubgoal()}
                  />
                  <Button onClick={addSubgoal} type="button" variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scripture" className="space-y-4 mt-4">
            {/* Same form as custom, but with scripture memorization defaults */}
            <div className="space-y-4">
              {/* Form fields identical to custom tab */}
              <div>
                <label
                  htmlFor="goal-title"
                  className="block text-sm font-medium mb-1"
                >
                  Goal Title
                </label>
                <Input
                  id="goal-title"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Enter your goal title"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="goal-description"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Describe your spiritual goal"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-deadline"
                  className="block text-sm font-medium mb-1"
                >
                  Target Date
                </label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">
                    Subgoals / Steps
                  </label>
                  <span className="text-xs text-gray-500">
                    {subgoals.length} steps
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {subgoals.map((subgoal) => (
                    <div
                      key={subgoal.id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{subgoal.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubgoal(subgoal.id)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newSubgoal}
                    onChange={(e) => setNewSubgoal(e.target.value)}
                    placeholder="Add a step"
                    onKeyDown={(e) => e.key === "Enter" && addSubgoal()}
                  />
                  <Button onClick={addSubgoal} type="button" variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Clock className="h-4 w-4 mr-2" /> Set Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
