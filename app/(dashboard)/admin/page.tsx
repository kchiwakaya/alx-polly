"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deletePoll } from "@/app/lib/actions/poll-actions";
import { createClient } from "@/lib/supabase/client";

/**
 * Poll Interface
 * 
 * @description Represents the structure of a poll object as retrieved from the database
 * 
 * @interface Poll
 */
interface Poll {
  /** Unique identifier for the poll */
  id: string;
  /** The poll question text */
  question: string;
  /** Identifier of the user who created the poll */
  user_id: string;
  /** Timestamp when the poll was created */
  created_at: string;
  /** Array of poll options/choices */
  options: string[];
}



/**
 * AdminPage Component
 * 
 * @description An administrative interface that displays all polls in the system and allows administrators
 * to manage them. This component fetches all polls from the database and provides functionality
 * to view poll details and delete polls.
 * 
 * @returns {JSX.Element} The rendered admin panel with a list of all polls
 */
export default function AdminPage() {
  /** State to store the list of all polls */
  const [polls, setPolls] = useState<Poll[]>([]);
  /** State to track if polls are currently being loaded */
  const [loading, setLoading] = useState(true);
  /** State to track which poll is currently being deleted (stores poll ID or null) */
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPolls();
  }, []);

  /**
   * Fetches all polls from the database
   * 
   * @description Retrieves all polls from the Supabase database, orders them by creation date
   * in descending order, and updates the component state with the fetched data.
   * 
   * @async
   * @function fetchAllPolls
   * @returns {Promise<void>}
   */
  const fetchAllPolls = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("polls")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPolls(data);
    }
    setLoading(false);
  };

  /**
   * Handles the deletion of a poll
   * 
   * @description Sets the loading state for the specific poll being deleted,
   * calls the deletePoll action, and updates the local state by removing the deleted poll
   * if the operation was successful.
   * 
   * @async
   * @function handleDelete
   * @param {string} pollId - The unique identifier of the poll to be deleted
   * @returns {Promise<void>}
   */
  const handleDelete = async (pollId: string) => {
    setDeleteLoading(pollId);
    const result = await deletePoll(pollId);

    if (!result.error) {
      setPolls(polls.filter((poll) => poll.id !== pollId));
    }

    setDeleteLoading(null);
  };

  if (loading) {
    return <div className="p-6">Loading all polls...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-600 mt-2">
          View and manage all polls in the system.
        </p>
      </div>

      <div className="grid gap-4">
        {polls.map((poll) => (
          <Card key={poll.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{poll.question}</CardTitle>
                  <CardDescription>
                    <div className="space-y-1 mt-2">
                      <div>
                        Poll ID:{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {poll.id}
                        </code>
                      </div>
                      <div>
                        Owner ID:{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {poll.user_id}
                        </code>
                      </div>
                      <div>
                        Created:{" "}
                        {new Date(poll.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(poll.id)}
                  disabled={deleteLoading === poll.id}
                >
                  {deleteLoading === poll.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium">Options:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {poll.options.map((option, index) => (
                    <li key={index} className="text-gray-700">
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No polls found in the system.
        </div>
      )}
    </div>
  );
}
