import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import ConnectionStatus from "@/components/ConnectionStatus";
import { Button } from "@/components/ui/button";
import JournalEntryCard from "./JournalEntryCard";
import CreateEntryDialog from "./CreateEntryDialog";
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/lib/api/journal";
import { checkSupabaseConnection } from "@/lib/supabase";

interface JournalEntryType {
  id: string;
  title: string;
  date: Date;
  content: string;
}

const JournalSection = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);

        const journalData = await getJournalEntries();

        // Transform the data to match our component's expected format
        const formattedEntries = journalData.map((entry) => ({
          id: entry.id,
          title: entry.title,
          date: new Date(entry.created_at),
          content: entry.content,
        }));

        setEntries(formattedEntries);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
        setError(
          "Failed to load journal entries. Please check your database connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleCreateEntry = async (entryData: any) => {
    try {
      setLoading(true);

      // Prepare data for API
      const entryToCreate = {
        title: entryData.title,
        content: entryData.content,
        prompt_type: entryData.promptType || "",
      };

      // Create the entry in the database
      const createdEntry = await createJournalEntry(entryToCreate);

      // Format the entry for our component
      const newEntry: JournalEntryType = {
        id: createdEntry.id,
        title: createdEntry.title,
        date: new Date(createdEntry.created_at),
        content: createdEntry.content,
      };

      // Add the new entry to the state
      setEntries([newEntry, ...entries]);
      setShowCreateDialog(false);
    } catch (err) {
      console.error("Error creating journal entry:", err);
      setError("Failed to create journal entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = async (
    id: string,
    updatedData: Partial<JournalEntryType>,
  ) => {
    try {
      setLoading(true);

      // Prepare data for API
      const entryToUpdate: any = {};
      if (updatedData.title) entryToUpdate.title = updatedData.title;
      if (updatedData.content) entryToUpdate.content = updatedData.content;

      // Update the entry in the database
      await updateJournalEntry(id, entryToUpdate);

      // Update the entry in the state
      setEntries(
        entries.map((entry) =>
          entry.id === id ? { ...entry, ...updatedData } : entry,
        ),
      );
    } catch (err) {
      console.error("Error updating journal entry:", err);
      setError("Failed to update journal entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      setLoading(true);

      // Delete the entry from the database
      await deleteJournalEntry(id);

      // Remove the entry from the state
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error("Error deleting journal entry:", err);
      setError("Failed to delete journal entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Spiritual Journal</h2>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="rounded-full"
          size="sm"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-1" /> New Entry
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && entries.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading journal entries...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>You don't have any journal entries yet.</p>
          <p className="text-sm mt-1">
            Click "New Entry" to create your first spiritual journal entry.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              id={entry.id}
              title={entry.title}
              date={entry.date}
              content={entry.content}
              onClick={() => console.log("View entry", entry.id)}
            />
          ))}
        </div>
      )}

      <CreateEntryDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateEntry={handleCreateEntry}
      />
    </div>
  );
};

export default JournalSection;
