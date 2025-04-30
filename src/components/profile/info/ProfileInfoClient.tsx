"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ProfileHeader from "./ProfileHeader";
import ProfileClasses from "./ProfileClasses";
import ProfileAdditionalInfo from "./ProfileAdditionalInfo";

export default function ProfileInfoClient({ user }: { user: any }) {
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

  return (
    <Card>
      <ProfileHeader
        user={user}
        formData={formData}
        setFormData={setFormData}
        editMode={editMode}
        setEditMode={setEditMode}
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
