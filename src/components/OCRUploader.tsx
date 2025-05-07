import { useState } from "react";

export default function OCRUploader() {
  const [text, setText] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {return;}
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setText(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <pre>{text}</pre>
    </div>
  );
}
