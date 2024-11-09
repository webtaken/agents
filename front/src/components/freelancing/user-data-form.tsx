"use client";
import { useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, X } from "lucide-react";
import { UserData } from "./types";
import { useLocalStorage } from "@uidotdev/usehooks";
import { USER_DATA_STORAGE_KEY } from "./data";
import { toast } from "sonner";

const suggestions = ["Show me the templates"];

export function UserDataForm({ fromChat }: { fromChat?: boolean }) {
  const [_, setMessages] = useUIState();
  const { submitUserMessage } = useActions();
  const [userDataLocal, saveUserDataLocal] = useLocalStorage<UserData | null>(
    USER_DATA_STORAGE_KEY,
    null
  );
  const [userData, setUserData] = useState<UserData>({
    name: "",
    jobTitle: "",
    description: "",
    skills: [],
  });
  const [firstLoad, setFirstLoad] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  if (userDataLocal && firstLoad) {
    setUserData({ ...userDataLocal });
    setFirstLoad(false);
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setUserData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setUserData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Saving user data to local storage
    saveUserDataLocal(userData);
    toast.success("User data saved successfully!");
    if (fromChat) {
      setShowSuggestions(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-md px-5 space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            value={userData.jobTitle}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            value={userData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {userData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center"
              >
                {skill}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
            />
            <Button type="button" onClick={handleAddSkill}>
              Add
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
      {showSuggestions && (
        <div className="flex items-center justify-center my-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              className="flex items-center gap-x-2"
              onClick={async () => {
                const response = await submitUserMessage(suggestion, []);
                setMessages((currentMessages: any[]) => [
                  ...currentMessages,
                  response,
                ]);
              }}
            >
              <Star className="h-4 w-4" />
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
