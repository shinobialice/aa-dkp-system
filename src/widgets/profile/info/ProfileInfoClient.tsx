"use client";
import { useEffect, useState } from "react";
import ProfileAdditionalInfo from "./ProfileAdditionalInfo";
import ProfileClasses from "./ProfileClasses";
import ProfileHeader from "./ProfileHeader";
import { Card, CardContent } from "@/shared/ui";

export default function ProfileInfoClient({
  user,
  tags: initialTags,
  isAdmin,
}: {
  user: any;
  tags: any[];
  isAdmin: boolean;
}) {
  const [tags, setTags] = useState(initialTags);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    class: user.class,
    classGearScore: user.class_gear_score,
    secondaryClass: user.secondary_class,
    secondaryClassGearScore: user.secondary_class_gear_score,
    vkName: user.vk_name,
    vkRealName: "",
    joined_at: user.joined_at
      ? new Date(user.joined_at).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  useEffect(() => {
    const fetchVkName = async () => {
      if (!formData.vkName) {
        return;
      }

      const res = await fetch(`/api/vk-name?username=${formData.vkName}`);
      const data = await res.json();

      if (data.name) {
        setFormData((prev) => ({ ...prev, vkRealName: data.name }));
      }
    };

    fetchVkName();
  }, [formData.vkName]);

  return (
    <Card>
      <ProfileHeader
        isAdmin={isAdmin}
        user={user}
        formData={formData}
        setFormData={setFormData}
        editMode={editMode}
        setEditMode={setEditMode}
        tags={tags}
      />
      <CardContent className="space-y-4">
        <ProfileClasses
          user={user}
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
        />
        <ProfileAdditionalInfo
          user={user}
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
        />
      </CardContent>
    </Card>
  );
}
