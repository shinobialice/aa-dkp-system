// "use client";
// import { useEffect, useState } from "react";

// // TODO Remove this hook and use and get this info from the nearest parent server component
// function useUserTag(tag: string) {
//   const [hasTag, setHasTag] = useState<boolean>(false);

//   useEffect(() => {
//     const checkTag = async () => {
//       try {
//         const res = await fetch(
//           `/api/user/has-tag?tag=${encodeURIComponent(tag)}`,
//           { credentials: "include" }
//         );
//         if (!res.ok) return;
//         const json = await res.json();
//         setHasTag(json.hasTag === true);
//       } catch {
//         // ignore
//       }
//     };
//     checkTag();
//   }, [tag]);

//   return hasTag;
// }

// export default useUserTag;
